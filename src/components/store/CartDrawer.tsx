'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cart.store'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    totalPrice,
  } = useCartStore()

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-card shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-foreground" />
                <h2 className="font-serif font-bold text-xl text-foreground">
                  Keranjang Anda
                </h2>
                <span className="bg-tan-100 text-tan-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={closeCart}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground opacity-50" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      Keranjang Anda kosong
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1 max-w-[250px]">
                      Temukan dompet kulit premium favorit Anda di koleksi kami.
                    </p>
                  </div>
                  <Button
                    onClick={closeCart}
                    asChild
                    variant="brand"
                    className="mt-4"
                  >
                    <Link href="/products">Mulai Belanja</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-4 overflow-hidden"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-24 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-1 flex-col justify-between py-1">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <Link
                                href={`/products/${item.slug}`}
                                onClick={closeCart}
                                className="font-medium text-sm text-foreground hover:text-tan-500 transition-colors line-clamp-2"
                              >
                                {item.name}
                              </Link>
                              {item.variantName && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {item.variantName}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                              aria-label="Hapus item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-border rounded-lg bg-background">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                                className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="font-semibold text-sm">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border bg-card">
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(totalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ongkos Kirim</span>
                    <span className="text-muted-foreground text-xs">Dihitung saat checkout</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">{formatPrice(totalPrice())}</span>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Button asChild variant="brand" className="w-full" onClick={closeCart}>
                    <Link href="/checkout">
                      Lanjut ke Pembayaran <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full" onClick={closeCart}>
                    <Link href="/cart">Lihat Detail Keranjang</Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
