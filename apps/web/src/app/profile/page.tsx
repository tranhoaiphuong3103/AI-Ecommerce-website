'use client';

import Image from 'next/image';
import type { User, UserMeasurements } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: { url: string; alt: string | null }[];
  };
  variant: {
    size: string;
    color: string | null;
  } | null;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [measurements, setMeasurements] = useState<UserMeasurements>({
    height: 170,
    weight: 65,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    fetchOrders(userData.id);
  }, [router]);

  const fetchMeasurements = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/measurements?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.measurements) setMeasurements(data.measurements);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async (userId: string) => {
    const response = await fetch(`/api/user/orders?userId=${userId}`);
    if (response.ok) {
      const data = await response.json();
      setOrders(data.orders || []);
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
    } catch {
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAID':
        return 'bg-gray-200 text-gray-800';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black" />
      </div>
    );

  return (
    <div className="min-h-screen py-12 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-4xl text-center font-bold mb-2 text-black uppercase tracking-tight">
            My Profile
          </h1>
          <p className="text-gray-600 text-center mb-8">Customize your AI try-on experience</p>

          <div className="mb-8 p-6 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold text-black mb-2 uppercase">Account Information</h2>
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {user?.name}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4 uppercase">Your Photo</h2>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-bold text-black mb-2">
                Photo Requirements for Best Results:
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  <span className="font-semibold">Full-body photo</span> - Head to toe visible
                </li>
                <li>Clear, well-lit photo with plain background</li>
                <li>Face clearly visible and facing the camera</li>
                <li>Standing upright in a natural pose</li>
                <li>3:4 aspect ratio recommended (portrait orientation)</li>
              </ul>
            </div>

            <div className="flex items-center gap-6">
              {measurements.photoUrl && (
                <div className="relative w-32 h-48 rounded-lg overflow-hidden border-2 border-gray-300">
                  <img
                    src={measurements.photoUrl}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <label className="cursor-pointer">
                <div className="px-6 py-3 bg-black text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors">
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

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4 uppercase">Purchase History</h2>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white bg-gray-100"
                          >
                            {item.product.images[0] ? (
                              <img
                                src={item.product.images[0].url}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No img
                              </div>
                            )}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm text-gray-700">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {order.items.map((item) => item.product.name).join(', ')}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-black">${order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-4">
                  Start shopping to see your purchase history here
                </p>
                <Link
                  href="/products"
                  className="inline-block px-6 py-3 bg-black text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
