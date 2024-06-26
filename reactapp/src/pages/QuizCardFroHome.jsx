import { React } from 'react'
import { Link,useNavigate } from 'react-router-dom';

export default function QuizCard({doc}) {
    const navigate = useNavigate();
  return (
    <>
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md bg-white border-black shadow-gray-700 shadow-lg hover:shadow-none" data-v0-t="card">
  <div class="grid gap-4 p-6">
    <div class="space-y-2">
      <h3 class="text-2xl font-bold">{doc.data.name}</h3>
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>{doc.data.CreatorName}</span>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4"
        >
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
          <path d="M3 10h18"></path>
          <path d="M8 14h.01"></path>
          <path d="M12 14h.01"></path>
          <path d="M16 14h.01"></path>
          <path d="M8 18h.01"></path>
          <path d="M12 18h.01"></path>
          <path d="M16 18h.01"></path>
        </svg>
        <span>{doc.data.date.toDate().toLocaleString()}</span>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-600">
        <span>Popularity {doc.data.Popularity}</span>
      </div>
    </div>
    <button type='button' onClick={()=>navigate(`/Play/${doc.id}`)} class="border-2 w-24 rounded-lg text-md">
      Play Quiz
    </button>
  </div>
</div>
    </>
  )
}
