import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DUMMY_PRODUCTS } from '@/lib/dummy-data'
import { ProductDetail } from '@/components/store/ProductDetail'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = DUMMY_PRODUCTS.find((p_ind) => p_ind.slug === params.slug)
  if (!product) return { title: 'Produk Tidak Ditemukan' }

  return {
    title: product.name,
    description: `Beli ${product.name} dompet kulit premium Raxie.`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = DUMMY_PRODUCTS.find((prod) => prod.slug === params.slug)

  if (!product) {
    notFound()
  }

  // TypeScript guard - notFound() throws, so we can safely assert non-null
  const safeProduct = product!

  // Simulate related products
  const relatedProducts = DUMMY_PRODUCTS.filter(
    (prod) => prod.categorySlug === safeProduct.categorySlug && prod.id !== safeProduct.id
  ).slice(0, 4)

  return (
    <div className="container-raxie py-8 md:py-12">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Koleksi', href: '/products' },
          { label: safeProduct.name },
        ]}
        className="mb-8"
      />

      <ProductDetail product={safeProduct} relatedProducts={relatedProducts} />
    </div>
  )
}
