import HistoryList from '@/components/HistoryList'

export default function HistoryPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">History</h1>
      <HistoryList />
    </div>
  )
}
