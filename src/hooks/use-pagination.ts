import { useCallback, useMemo, useState } from "react"
import { spliceArray } from "~/utils/helpers"

export const usePagination = ({itemsPerPage, items}:{itemsPerPage: number, items: any[]}) => {
  const [currentPage, setCurrentPage] = useState<number>(0)
  const pages = useMemo(() => spliceArray(items, itemsPerPage), [items, itemsPerPage])

  const nextPage = useCallback(
    () => {
      setCurrentPage(page => page+1)
    },
    [setCurrentPage],
  )
  const previousPage = useCallback(
    () => {
      setCurrentPage(page => page - 1)
    },
    [setCurrentPage],
  )
  return {pages: pages, currentPage, nextPage, previousPage}
}