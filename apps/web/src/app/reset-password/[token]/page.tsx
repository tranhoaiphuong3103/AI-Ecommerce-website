import ResetPasswordForm from '@/components/ResetPasswordForm';

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({ params }: PageProps) {
  const { token } = await params;
  return <ResetPasswordForm token={token} />;
}
