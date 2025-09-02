import NewCopyForm from '@/components/NewCopyForm'

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Website Copy Generator</h1>
      <NewCopyForm />
    </div>
  )
}
