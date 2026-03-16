"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Caravan, BookOpen, School, X, Check, ChevronDown } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface School {
  id: string
  name: string
}

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  available: number
}

interface TransferDialogProps {
  children: React.ReactNode
}

export default function TransferDialog({ children }: TransferDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState("")
  const [selectedBooks, setSelectedBooks] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const [schoolSearch, setSchoolSearch] = useState("")
  const [bookSearch, setBookSearch] = useState("")

  // Sample data - in real app, these would come from API
  const schools: School[] = [
    { id: "1", name: "Мактаби №1 шаҳри Душанбе" },
    { id: "2", name: "Мактаби №5 шаҳри Душанбе" },
    { id: "3", name: "Мактаби №12 шаҳри Душанбе" },
    { id: "4", name: "Мактаби №3 шаҳри Хуҷанд" },
    { id: "5", name: "Мактаби №8 шаҳри Кӯлоб" },
    { id: "6", name: "Мактаби №2 шаҳри Бохтар" },
    { id: "7", name: "Мактаби №15 шаҳри Душанбе" },
    { id: "8", name: "Мактаби №7 шаҳри Истаравшан" },
  ]

  const books: Book[] = [
    { id: "1", title: "Рӯдакӣ", author: "Садриддин Айнӣ", isbn: "978-999-47-0-1", available: 5 },
    { id: "2", title: "Дастури алфабон", author: "С. Айнӣ", isbn: "978-999-47-0-2", available: 3 },
    { id: "3", title: "Қиссаи ҳаёт", author: "Садриддин Айнӣ", isbn: "978-999-47-0-3", available: 2 },
    { id: "4", title: "Ёддоштҳо", author: "Садриддин Айнӣ", isbn: "978-999-47-0-4", available: 4 },
    { id: "5", title: "Таърихи адабиёти тоҷик", author: "Раҳим Ҳошим", isbn: "978-999-47-0-5", available: 6 },
    { id: "6", title: "Фарҳанги забони тоҷикӣ", author: "М. Фарҳанг", isbn: "978-999-47-0-6", available: 8 },
    { id: "7", title: "Гулшан", author: "Абдураҳмони Ҷомӣ", isbn: "978-999-47-0-7", available: 1 },
    { id: "8", title: "Бадъи-л-вақоъ", author: "Васофи", isbn: "978-999-47-0-8", available: 3 },
  ]

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(schoolSearch.toLowerCase())
  )

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
    book.author.toLowerCase().includes(bookSearch.toLowerCase())
  )

  const toggleBookSelection = (bookId: string) => {
    setSelectedBooks(prev =>
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    )
  }

  const selectedBooksData = books.filter(book => selectedBooks.includes(book.id))

  const handleSubmit = () => {
    if (!selectedSchool || selectedBooks.length === 0 || !description.trim()) {
      alert("Лутфан ҳамаи майдонҳоро пур кунед!")
      return
    }

    console.log("Transfer data:", {
      schoolId: selectedSchool,
      books: selectedBooks,
      description
    })

    // Here you would make API call to create transfer
    setOpen(false)
    // Reset form
    setSelectedSchool("")
    setSelectedBooks([])
    setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Caravan className="w-6 h-6 text-blue-600" />
            Интиқоли китобҳо
          </DialogTitle>
          <DialogDescription>
            Китобҳоро ба мактаби дигар интиқол диҳед
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* School Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <School className="w-4 h-4" />
              Интиқол ба мактаб
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between w-full border-gray-300 rounded-xl">
                  {selectedSchool
                    ? schools.find(s => s.id === selectedSchool)?.name || "Интихоб..."
                    : "Ҷустуҷӯи мактаб..."}
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-112.5 max-h-48 overflow-y-auto rounded-xl shadow-lg">
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Номи мактаб..."
                      value={schoolSearch}
                      onChange={(e) => setSchoolSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                {filteredSchools.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">Мактаб ёфт нашуд.</div>
                ) : (
                  filteredSchools.map((school) => (
                    <DropdownMenuItem 
                      key={school.id} 
                      onClick={() => setSelectedSchool(school.id)}
                      className="py-3 px-4 cursor-pointer"
                    >
                      <Check className={cn("mr-2 h-4 w-4 text-[#0950c3]", selectedSchool === school.id ? "opacity-100" : "opacity-0")} />
                      <div>
                        <div className="font-medium">{school.name}</div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Book Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Интиқоли китобҳо
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between w-full border-gray-300 rounded-xl">
                  {selectedBooks.length > 0
                    ? `${selectedBooks.length} китоб интихоб шуд`
                    : "Ҷустуҷӯи китобҳо..."}
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-125 max-h-48 overflow-y-auto rounded-xl shadow-lg">
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Номи китоб ё муаллиф..."
                      value={bookSearch}
                      onChange={(e) => setBookSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                {filteredBooks.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">Китоб ёфт нашуд.</div>
                ) : (
                  filteredBooks.map((book) => (
                    <DropdownMenuItem 
                      key={book.id} 
                      onClick={() => toggleBookSelection(book.id)}
                      className="py-3 px-4 cursor-pointer"
                    >
                      <Check className={cn("mr-2 h-4 w-4 text-[#0950c3]", selectedBooks.includes(book.id) ? "opacity-100" : "opacity-0")} />
                      <div className="flex-1">
                        <div className="font-medium">{book.title}</div>
                        <div className="text-xs text-gray-500">{book.author}</div>
                        <div className="text-xs text-gray-400 mt-1">ISBN: {book.isbn}</div>
                      </div>
                      <Badge variant={book.available > 0 ? "default" : "destructive"} className="text-xs ml-2">
                        {book.available}
                      </Badge>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Selected Books Summary */}
          {selectedBooks.length > 0 && (
            <div className="space-y-2">
              <Label className="text-base font-medium">Китобҳои интихобшуда:</Label>
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                {selectedBooksData.map((book) => (
                  <Badge key={book.id} variant="secondary" className="text-xs">
                    {book.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-3">
            <Label className="text-base font-medium" htmlFor="description">
              Шарҳи интиқол
            </Label>
            <Textarea
              id="description"
              placeholder="Сабаби интиқоли китобҳоро нависед..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-25 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Бекор кардан
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedSchool || selectedBooks.length === 0 || !description.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Caravan className="w-4 h-4 mr-2" />
              Равон кардан
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
