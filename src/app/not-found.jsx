import Link from "next/link"

export default function notFound() {
    return(
      <div className="grid w-full h-[100vh]">
        <div className="place-self-center text-center">
            <div className="text-4xl">
              error 404 | Not found
            </div>
            <div className="text-base-content opacity-0.95 m-2 underline">
              <Link href="/">Go back</Link>
            </div>
        </div>
      </div>
    )
  }