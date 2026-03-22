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
import { useGetBooksSchoolQuery, IGetbooksSchool, useGetSchoolsByDistrictQuery, useGetMeQuery, useCreateTransfersMutation } from "@/api/api"
import toast, { Toaster } from "react-hot-toast"

interface School {
  id: string
  name: string
}

interface ApiResponse {
  items: IGetbooksSchool[];
  total: number;
  page: number;
  size: number;
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

  const { data: Me } = useGetMeQuery();
  const districtId = Me?.district_id;
  const currentSchoolId = Me?.school_id?.toString();
  const { data: books, isLoading } = useGetBooksSchoolQuery({
    skip: 0,
    limit: 100
  });
  const { data: schools, isLoading: schoolsLoading } = useGetSchoolsByDistrictQuery(districtId, {
    skip: !districtId,
  });
  const [createtransfer, { isLoading: createtransferIsLoading }] = useCreateTransfersMutation();

  const filteredSchools = schools?.filter(school => {
    return school.name.toLowerCase().includes(schoolSearch.toLowerCase()) && school.id.toString() !== currentSchoolId;
  }) || []

  const filteredBooks = (books?.items || []).filter((book: IGetbooksSchool) => {
    const isAvailable = book.status === "available";
    const matchesSearch =
      book.textbook?.title?.toLowerCase().includes(bookSearch.toLowerCase()) ||
      book.inventory_number?.includes(bookSearch);

    return isAvailable && matchesSearch;
  });

  const toggleBookSelection = (bookId: string) => {
    setSelectedBooks(prev =>
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    )
  }

  const selectedBooksData = books?.items?.filter((book: IGetbooksSchool) =>
    selectedBooks.includes(book.id.toString())
  )

  const handleSubmit = async () => {
    if (!selectedSchool || selectedBooks.length === 0 || !description.trim()) {
      toast("Лутфан ҳамаи майдонҳоро пур кунед!");
      return;
    }

    try {
      await createtransfer({
        to_school_id: Number(selectedSchool),
        textbook_copy_ids: selectedBooks.map(id => Number(id)),
        reason: description
      }).unwrap();

      setOpen(false);
      setSelectedSchool("");
      setSelectedBooks([]);
      setDescription("");
      toast.success("Трансфер бо муваффақият сохта шуд!");
    } catch (error) {
      console.error("Хатогӣ ҳангоми сохтани трансфер:", error);
      toast.error("Хатогӣ рӯй дод. Дубора кӯшиш кунед.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster />
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
                    ? schools?.find(s => s.id === selectedSchool)?.name || "Интихоб..."
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
                {filteredSchools?.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">Мактаб ёфт нашуд.</div>
                ) :
                  filteredSchools?.map((school) => (
                    <DropdownMenuItem
                      key={school.id}
                      onClick={() => setSelectedSchool(school.id.toString())}
                      className="py-3 px-4 cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-[#0950c3]",
                          selectedSchool === school.id.toString() ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div>
                        <div className="font-medium">
                          {school.name}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                }

              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
                  filteredBooks.map((book: IGetbooksSchool) => (
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        toggleBookSelection(book.id.toString());
                      }}
                      key={book.id}
                      className="py-3 px-4 cursor-pointer"
                    >
                      <Check className={cn("mr-2 h-4 w-4 text-[#0950c3]", selectedBooks.includes(book.id.toString()) ? "opacity-100" : "opacity-0")} />
                      <div className="flex-1">
                        <div className="font-medium">{book.textbook.title}</div>
                        <div className="text-xs text-gray-500">{book.textbook.author}</div>
                        <Badge className="text-xs  mt-1  bg-gray-200 text-gray-600">Синф: {book.textbook.grade}</Badge>
                      </div>
                      <Badge className="text-xs ml-2 bg-gray-200 text-gray-600">
                        {book.textbook.isbn}
                      </Badge>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {selectedBooks.length > 0 && (
            <div className="space-y-2">
              <Label className="text-base font-medium">Китобҳои интихобшуда {selectedBooks.length}:</Label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg bg-slate-50">
                {selectedBooksData?.map((book) => (
                  <Badge
                    key={book.id}
                    variant="secondary"
                    className="text-xs py-1 px-2 flex items-center gap-1 group"
                  >
                    <span className="max-w-[150px] truncate">
                      {book.textbook.title}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleBookSelection(book.id.toString());
                      }}
                      className="rounded-full hover:bg-red-100 cursor-pointer p-0.5 group/btn transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-red-500" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

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
