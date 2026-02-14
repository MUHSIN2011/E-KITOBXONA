"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button"; // Компонентҳои худро истифода баред
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";
import { PackageCheck, Loader2, Barcode, ArrowRightCircle, BookCheck } from "lucide-react";
import { useAcceptBookItemMutation, useGetSupplyByIdQuery } from "@/src/api/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function SupplyDetails() {
  const params = useParams();
  const supplyId = params.supplyId;

  const { data: supplyData, isLoading, isError } = useGetSupplyByIdQuery(supplyId);

  const [acceptBookItem, { isLoading: isAccepting }] = useAcceptBookItemMutation();


  const handleAccept = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!selectedSupplyId) return;

    try {
      await acceptBookItem({
        item_id: Number(selectedSupplyId),
        inventory_number: inventoryNumber,
      }).unwrap();

      toast.success("Китоб бо муваффақият қабул шуд");

      setIsDialogOpen(false);
      setInventoryNumber("");
      setSelectedSupplyId(null);

    } catch (err: any) {
      const errorMessage = err.data?.detail || "Хатогӣ рӯй дод";

      if (errorMessage === "Копия уже обработана") {
        toast.error("Ин китоб аллакай қабул шудааст!");
      } else {
        toast.error(String(errorMessage));
      }

      console.log("Server response:", err.data);
      setIsDialogOpen(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const allItems = supplyData?.items || [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  const [selectedSupplyId, setSelectedSupplyId] = React.useState<number | null>(null);
  const [inventoryNumber, setInventoryNumber] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  if (isLoading) return <div className="flex h-[80vh] items-center justify-center ">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>;
  if (isError || !supplyData) return <div className="p-20 text-red-500">Хатогӣ ҳангоми бор кардани маълумот!</div>;

  return (
    <div className=" overflow-hidden bg-gray-50  flex flex-col">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">

        <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Партияи №{supplyData.id}</h1>
            <p className="text-gray-500">Китоб: <span className="font-semibold">{supplyData.textbook_title}</span></p>
          </div>
          <div className="text-right">
            <span className="block text-sm text-gray-400">Ҳамагӣ: {supplyData.total_quantity} дона</span>
            <span className="text-blue-600 font-bold">Интизорӣ: {supplyData.pending_count}</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-gray-100 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-25 pl-8">ID</TableHead>
                <TableHead>Ном</TableHead>
                <TableHead>Синф</TableHead>
                <TableHead>Санаи Сохтан</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Рақами инвентарӣ</TableHead>
                <TableHead>Санаи Сохтан</TableHead>
                <TableHead className="text-right pr-9">Амал</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems?.map((item: any) => (
                <TableRow key={item.id} className="hover:bg-gray-50 transition-colors h-12">
                  <TableCell className="font-medium text-gray-600 pl-8">#{item.id}</TableCell>
                  <TableCell className="text-gray-600 px-3">{item.textbook_title}</TableCell>
                  <TableCell className="text-gray-600 px-3">{item.textbook_grade}</TableCell>
                  <TableCell className="text-gray-600 px-3 italic">
                    {new Date(item.created_at).toLocaleDateString('ru-RU')}
                  </TableCell>

                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                      {item.status === 'pending' ? 'Интизорӣ' : 'Қабулшуда'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-700 font-mono text-xs">
                      <Barcode size={14} className="text-gray-400" />
                      {item.inventory_number || <span className="text-gray-300">Холи</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 px-3 italic">
                    {item.status === "accepted" && item.processed_at ? (
                      new Date(item.processed_at).toLocaleDateString('ru-RU')
                    ) : (
                      <span className="text-gray-400 not-italic">—:—:—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-7">
                    {item.status === 'pending' ? (
                      <Button
                        onClick={() => {
                          setSelectedSupplyId(item.id);
                          setIsDialogOpen(true);
                        }}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-emerald-500 hover:bg-emerald-50 rounded-full"
                      >
                        <ArrowRightCircle size={18} />
                      </Button>
                    ) : (
                      <span className="text-emerald-600 text-xs font-bold px-3">Қабул шуд</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookCheck className="text-blue-500" /> Қабули партияи №{selectedSupplyId}
              </DialogTitle>
              <DialogDescription>
                Рақами инвентарии китобро ворид кунед. Ин рақам барои баҳисобгирии минбаъда зарур аст.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAccept} className="space-y-4 py-4">
              <div className="space-y-4">
                <label className="text-sm font-medium">Рақами инвентарӣ</label>
                <Input
                  autoFocus
                  placeholder="Масалан: 0001"
                  value={inventoryNumber}
                  onChange={(e) => setInventoryNumber(e.target.value)}
                  className="focus-visible:ring-blue-500 mt-2"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Баргаштан
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Дар ҳоли қабул..." : "Тасдиқ ва қабул"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <div className="text-sm text-gray-500">
            Намоиши {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, supplyData.items?.length || 0)} аз {supplyData.items?.length}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Пештара
            </Button>
            <div className="flex items-center px-4 text-sm font-medium">
              Саҳифаи {currentPage} аз {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Баъдина
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}