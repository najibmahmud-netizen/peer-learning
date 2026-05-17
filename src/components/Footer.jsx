import { Link } from 'react-router-dom'

export default function Footer() {
return (
<footer className="bg-gray-900 text-gray-300">
<div className="flex gap-4 text-sm">
<a href="#" className="hover:text-white transition-colors">
GitHub
</a>

<a href="#" className="hover:text-white transition-colors">
Twitter
</a>

<a href="#" className="hover:text-white transition-colors">
Email
</a>
</div>
</footer>
)
}