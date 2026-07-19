import { DUMMY_PRODUCTS } from '@/lib/dummy-data'
import { ProductCard } from '@/components/store/ProductCard'
import { ProductSort } from '@/components/store/ProductSort'

interface ProductGridProps {
  searchParams: {
    q?: string
    category?: string
    sort?: string
    page?: string
  }
}

export async function ProductGrid({ searchParams }: ProductGridProps) {
  // Simulate network delay for SSR
  await new Promise((resolve) => setTimeout(resolve, 800))

  let products = [...DUMMY_PRODUCTS]

  // Filtering
  if (searchParams.q) {
    const q = searchParams.q.toLowerCase()
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
  }

  if (searchParams.category && searchParams.category !== 'semua produk') {
    const cat = searchParams.category.toLowerCase()
    products = products.filter(
      (p) =>
        p.categorySlug === cat ||
        p.tags.includes(cat) ||
        (cat === 'aksesoris' && p.categorySlug === 'aksesoris')
    )
  }

  // Sorting
  if (searchParams.sort) {
    switch (searchParams.sort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        products.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        products.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1))
        break
      case 'best-seller':
        products.sort((a, b) =>
          a.isBestSeller === b.isBestSeller ? 0 : a.isBestSeller ? -1 : 1
        )
        break
      case 'rating':
        products.sort((a, b) => b.avgRating - a.avgRating)
        break
    }
  }

  return (
    <div>
      {/* Header / Sort */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <p className="text-sm text-muted-foreground">
          Menampilkan <span className="font-semibold text-foreground">{products.length}</span> produk
        </p>
        
        <ProductSort />
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center">
          <h3 className="text-lg font-semibold text-foreground">Tidak ada produk yang ditemukan</h3>
          <p className="text-muted-foreground mt-2">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
