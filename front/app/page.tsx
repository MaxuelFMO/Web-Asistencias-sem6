import { redirect } from 'next/navigation';

export default function Home() {
  // Redirige a dashboard o login
  redirect('/dashboard');
}
