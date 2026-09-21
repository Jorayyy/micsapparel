"use client";

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="font-oswald text-4xl font-bold text-gray-900 uppercase tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2">Manage your MicsApparel website</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a
          href="/admin/logo"
          className="p-8 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="font-oswald text-lg font-bold text-gray-900 uppercase tracking-wider mb-2">
            Logo
          </h2>
          <p className="text-gray-500 text-sm">
            Update your brand logo displayed across the site
          </p>
        </a>

        <a
          href="/admin/products"
          className="p-8 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="font-oswald text-lg font-bold text-gray-900 uppercase tracking-wider mb-2">
            Products
          </h2>
          <p className="text-gray-500 text-sm">
            Add, edit, or remove products from your catalog
          </p>
        </a>

        <a
          href="/admin/content"
          className="p-8 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="font-oswald text-lg font-bold text-gray-900 uppercase tracking-wider mb-2">
            Content
          </h2>
          <p className="text-gray-500 text-sm">
            Edit business info, testimonials, and FAQs
          </p>
        </a>
      </div>

      {/* Quick Stats */}
      <div className="mt-16">
        <h3 className="font-oswald text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-6">
          Quick Info
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">
              Website
            </p>
            <a
              href="https://micsapparel.vercel.app"
              target="_blank"
              className="text-gray-900 text-sm font-medium hover:text-gray-600 transition-colors"
            >
              micsapparel.vercel.app
            </a>
          </div>
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">
              Admin Password
            </p>
            <p className="text-gray-900 text-sm font-medium">micsapparel2024</p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">
              GitHub
            </p>
            <a
              href="https://github.com/Jorayyy/micsapparel"
              target="_blank"
              className="text-gray-900 text-sm font-medium hover:text-gray-600 transition-colors"
            >
              github.com/Jorayyy/micsapparel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
