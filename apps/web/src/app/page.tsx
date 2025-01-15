import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  return redirect('/auth')
}
