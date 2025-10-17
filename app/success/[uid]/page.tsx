// // ./app/success/[uid]/page.tsx (Server Component)

// import SuccessClient from "./SuccessClient" // Ensure this path is correct

// // 💥 FIX: Component is ASYNC, allowing 'await params'
// export default async function SuccessPage({ params }: { params: { uid: string } }) {
  
//   // Safely await the parameter object before accessing the 'uid' property
//   const uid = (await params).uid

//   // Pass the resolved 'uid' as a simple prop to the Client Component
//   // This resolves the error: 'Type '{ uid: string; }' is not assignable...'
//   return <SuccessClient uid={uid} />
// }

// ./app/success/[uid]/page.tsx

import { notFound } from "next/navigation"
import SuccessClient from "./SuccessClient"

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ uid: string }>
}) {
  // ✅ Await the async params object
  const { uid } = await params

  if (!uid) {
    notFound()
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <SuccessClient uid={uid} />
    </main>
  )
}
