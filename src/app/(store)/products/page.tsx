import { Suspense } from 'react'
import { Metadata } from 'next'
import { FilterSidebar } from '@/components/store/FilterSidebar'
import { ProductGrid } from '@/components/store/ProductGrid'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Koleksi Produk',
  description: 'Jelajahi koleksi dompet dan aksesoris kulit premium dari Raxie.',
}

interface ProductsPageProps {
  searchParams: {
    q?: string
    category?: string
    sort?: string
    page?: string
    minPrice?: string
    maxPrice?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const q = searchParams.q || ''
  const category = searchParams.category || 'Semua Produk'

  return (
    <div className="container-raxie py-8 md:py-12">
      {/* Breadcrumbs & Header */}
      <div className="mb-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Koleksi', href: '/products' },
            ...(searchParams.category ? [{ label: searchParams.category, href: `/products?category=${searchParams.category}` }] : []),
          ]}
        />
        <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground capitalize">
              {q ? `Pencarian: "${q}"` : category}
            </h1>
            <p className="text-muted-foreground mt-2">
              Menampilkan koleksi terbaik kami untuk Anda.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Desktop (Filters) */}
        <div className="hidden lg:block w-64 flex-shrink-0 sticky top-24">
          <FilterSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full">
          <Suspense fallback={<ProductGridSkeleton count={12} />}>
            <ProductGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
