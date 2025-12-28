'use client';

import CustomSelect from '@/components/CustomSelect';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface UserMeasurements {
  height: number;
  weight: number;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulder?: number;
  photoUrl?: string;
  skinTone?: string;
  hairColor?: string;
  gender?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [measurements, setMeasurements] = useState<UserMeasurements>({
    height: 170,
    weight: 65,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(userString);
    setUser(userData);

    fetchMeasurements(userData.id);
  }, [router]);

  const fetchMeasurements = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/measurements?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.measurements) {
          setMeasurements(data.measurements);
        }
      }
    } catch (_error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);

      const response = await fetch('/api/user/upload-photo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const data = await response.json();
      setMeasurements((prev) => ({ ...prev, photoUrl: data.photoUrl }));
      toast.success('Photo uploaded successfully!');
    } catch (_error) {
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);

    try {
      const response = await fetch('/api/user/measurements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          measurements,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save measurements');
      }

      toast.success('Profile updated successfully!');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save profile. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl shadow-purple-500/10 p-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              My Profile
            </span>
          </h1>
          <p className="text-gray-600 mb-8">Customize your AI try-on experience</p>

          {/* User Info */}
          <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Account Information</h2>
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {user?.name}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
          </div>

          {/* Photo Upload */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Photo</h2>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
              <h3 className="text-sm font-bold text-purple-900 mb-2">
                📸 Photo Requirements for Best Results:
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  ✅ <strong>Full-body photo</strong> - Head to toe visible
                </li>
                <li>✅ Clear, well-lit photo with plain background</li>
                <li>✅ Face clearly visible and facing the camera</li>
                <li>✅ Standing upright in a natural pose</li>
                <li>✅ 3:4 aspect ratio recommended (portrait orientation)</li>
              </ul>
            </div>

            <div className="flex items-center gap-6">
              {measurements.photoUrl && (
                <div className="relative w-32 h-48 rounded-xl overflow-hidden border-2 border-purple-200">
                  <img
                    src={measurements.photoUrl}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <label className="cursor-pointer">
                <div className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                  {uploadingPhoto
                    ? 'Uploading...'
                    : measurements.photoUrl
                      ? 'Change Photo'
                      : 'Upload Photo'}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploadingPhoto}
                />
              </label>
            </div>
          </div>

          {/* Measurements */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Body Measurements</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="height" className="block text-sm font-semibold text-gray-700 mb-2">
                  Height (cm) *
                </label>
                <input
                  id="height"
                  type="number"
                  value={measurements.height}
                  onChange={(e) =>
                    setMeasurements({ ...measurements, height: Number.parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-600 focus:outline-none text-gray-900 placeholder-gray-500"
                  placeholder="Enter height"
                  required
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  id="weight"
                  type="number"
                  value={measurements.weight}
                  onChange={(e) =>
                    setMeasurements({ ...measurements, weight: Number.parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-600 focus:outline-none text-gray-900 placeholder-gray-500"
                  placeholder="Enter weight"
                  required
                />
              </div>

              <div>
                <label htmlFor="chest" className="block text-sm font-semibold text-gray-700 mb-2">
                  Chest (cm)
                </label>
                <input
                  id="chest"
                  type="number"
                  value={measurements.chest || ''}
                  onChange={(e) =>
                    setMeasurements({
                      ...measurements,
                      chest: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-600 focus:outline-none text-gray-900 placeholder-gray-500"
                  placeholder="Enter chest measurement"
                />
              </div>

              <div>
                <label htmlFor="waist" className="block text-sm font-semibold text-gray-700 mb-2">
                  Waist (cm)
                </label>
                <input
                  id="waist"
                  type="number"
                  value={measurements.waist || ''}
                  onChange={(e) =>
                    setMeasurements({
                      ...measurements,
                      waist: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-600 focus:outline-none text-gray-900 placeholder-gray-500"
                  placeholder="Enter waist measurement"
                />
              </div>

              <div>
                <label htmlFor="hips" className="block text-sm font-semibold text-gray-700 mb-2">
                  Hips (cm)
                </label>
                <input
                  id="hips"
                  type="number"
                  value={measurements.hips || ''}
                  onChange={(e) =>
                    setMeasurements({
                      ...measurements,
                      hips: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-600 focus:outline-none text-gray-900 placeholder-gray-500"
                  placeholder="Enter hips measurement"
                />
              </div>

              <div>
                <label
                  htmlFor="shoulder"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Shoulder (cm)
                </label>
                <input
                  id="shoulder"
                  type="number"
                  value={measurements.shoulder || ''}
                  onChange={(e) =>
                    setMeasurements({
                      ...measurements,
                      shoulder: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-600 focus:outline-none text-gray-900 placeholder-gray-500"
                  placeholder="Enter shoulder measurement"
                />
              </div>
            </div>
          </div>

          {/* Personalization */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Personalization</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="skinTone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Skin Tone
                </label>
                <CustomSelect
                  id="skinTone"
                  value={measurements.skinTone || ''}
                  onChange={(value) => setMeasurements({ ...measurements, skinTone: value })}
                  placeholder="Select skin tone"
                  options={[
                    { value: '', label: 'Select skin tone' },
                    { value: 'fair', label: 'Fair' },
                    { value: 'light', label: 'Light' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'tan', label: 'Tan' },
                    { value: 'dark', label: 'Dark' },
                  ]}
                />
              </div>

              <div>
                <label
                  htmlFor="hairColor"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Hair Color
                </label>
                <CustomSelect
                  id="hairColor"
                  value={measurements.hairColor || ''}
                  onChange={(value) => setMeasurements({ ...measurements, hairColor: value })}
                  placeholder="Select hair color"
                  options={[
                    { value: '', label: 'Select hair color' },
                    { value: 'black', label: 'Black' },
                    { value: 'brown', label: 'Brown' },
                    { value: 'blonde', label: 'Blonde' },
                    { value: 'red', label: 'Red' },
                    { value: 'gray', label: 'Gray/White' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender
                </label>
                <CustomSelect
                  id="gender"
                  value={measurements.gender || ''}
                  onChange={(value) => setMeasurements({ ...measurements, gender: value })}
                  placeholder="Select gender"
                  options={[
                    { value: '', label: 'Select gender' },
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'unisex', label: 'Prefer not to say' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
