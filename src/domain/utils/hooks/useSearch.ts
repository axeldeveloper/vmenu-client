import Product from '@domain/entities/Product'
import GetProducts from '@domain/usecases/products/GetProducts'
import { useEffect, useState } from 'react'

export default function useSearch(): [Product[], (query: string) => void] {
  const [products, setProducts] = useState<Product[]>([])
  const [results, setResults] = useState<Product[]>([])

  useEffect(() => {
    GetProducts().then(results => setProducts(results))
  }, [])

  const hasQuery = (product: Product, query: string) => {
    const name = product.name.toLocaleLowerCase()
    const description = product.description.toLocaleLowerCase()
    const searchTerm = query.toLocaleLowerCase()
    return name.includes(searchTerm) || description.includes(searchTerm)
  }

  const getResults = (query: string) => {
    setResults(products.filter(product => hasQuery(product, query)))
  }

  return [results, getResults]
}
