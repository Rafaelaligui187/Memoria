import Link from "next/link"
import { BookOpen } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Memoria
              </span>
            </div>
            <p className="text-gray-400">
              Consolatrix College of Toledo City, Inc. Digital Yearbook - Preserving memories that last a lifetime.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Faculty & Staff
                </Link>
              </li>
              <li>
                <Link href="/school-history" className="text-gray-400 hover:text-purple-400 transition-colors">
                  School History
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <address className="not-italic text-gray-400">
              <p>Consolatrix College of Toledo City, Inc.</p>
              <p>Toledo City</p>
              <p>Email: info@consolatrix.edu.ph</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Memoria - Consolatrix College of Toledo City, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
