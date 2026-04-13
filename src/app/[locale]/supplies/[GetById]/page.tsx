"use client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button"; // Компонентҳои худро истифода баред
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { PackageCheck, Loader2, Barcode, ArrowRightCircle, BookCheck } from "lucide-react";
import { useAcceptBookItemMutation, useGetSupplyByIdQuery } from "@/api/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export default function SupplyDetails() {
  const params = useParams();
  const supplyId = params.GetById;
  const t = useTranslations('SupplyBatchPage')

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

      if (errorMessage === `Инвентарный номер ${inventoryNumber} уже существует`) {
        toast.error("Ин китоб аллакай қабул шудааст!");
      }
      else if (errorMessage === "Копия уже обработана ") {
        toast.error("Ин китоб аллакай қабул шудааст!");
      }
      else {
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
    <div className="overflow-hidden bg-gray-50 dark:bg-gray-900 md:p-0 p-3 flex flex-col min-h-screen">
      <Toaster position="top-center" />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full overflow-hidden">

        <div className="p-4 sm:p-5 md:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
          <div className="text-center sm:text-left">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
              {t('title', { id: supplyData.id })}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t('bookLabel')}: <span className="font-semibold">{supplyData.textbook_title}</span>
            </p>
          </div>
          <div className="text-center sm:text-right">
            <span className="block text-xs sm:text-sm text-gray-400 dark:text-gray-400">
              {t('total', { count: supplyData.total_quantity })}
            </span>
            <span className="text-blue-600 font-bold text-sm sm:text-base">
              {t('pending', { count: supplyData.pending_count })}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="space-y-3 md:hidden p-1">
            {currentItems?.map((item: any) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-4 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        #{item.id} · {item.textbook_grade}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {item.textbook_title}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'pending'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}>
                      {item.status === 'pending' ? t('table.pending') : t('table.accepted')}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{t('table.inventoryNumber')}:</span>{' '}
                      {item.inventory_number || <span className="text-gray-400">{t('table.empty')}</span>}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{t('table.postDate')}:</span>{' '}
                      {item.status === 'accepted' && item.processed_at ? new Date(item.processed_at).toLocaleDateString('ru-RU') : <span className="text-gray-400">{t('table.notProcessed')}</span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    {item.status === 'pending' ? (
                      <Button
                        onClick={() => {
                          setSelectedSupplyId(item.id);
                          setIsDialogOpen(true);
                        }}
                        variant="outline"
                        className="flex-1 h-10 rounded-xl border-gray-200 dark:border-gray-700 text-sm"
                      >
                        {t('table.action')}
                      </Button>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase">
                        {t('table.accepted')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {currentItems.length === 0 && (
              <div className="rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-sm text-gray-500 dark:text-gray-400">
                Маълумот вуҷуд надорад
              </div>
            )}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <Table className="min-w-[300px] md:min-w-full">
              <TableHeader className="bg-gray-100 dark:bg-gray-900/50 sticky top-0 z-10">
                <TableRow className="dark:hover:bg-gray-900">
                  <TableHead className="w-16 sm:w-20 pl-3 sm:pl-4 md:pl-8 text-xs sm:text-sm">#{t('table.id')}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t('table.name')}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t('table.grade')}</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">{t('table.postDate')}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t('table.status')}</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">{t('table.inventoryNumber')}</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden lg:table-cell">{t('table.createdDate')}</TableHead>
                  <TableHead className="text-right pr-3 sm:pr-4 md:pr-7 text-xs sm:text-sm">{t('table.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems?.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    {/* ID */}
                    <TableCell className="font-medium text-gray-600 dark:text-gray-300 pl-3 sm:pl-4 md:pl-8 text-xs sm:text-sm">
                      #{item.id}
                    </TableCell>

                    {/* Book Name */}
                    <TableCell className="text-gray-600 dark:text-gray-300 px-2 sm:px-3 text-xs sm:text-sm min-w-[150px]">
                      <div className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-none" title={item.textbook_title}>
                        {item.textbook_title}
                      </div>
                    </TableCell>

                    {/* Grade */}
                    <TableCell className="text-gray-600 dark:text-gray-300 px-2 sm:px-3 text-xs sm:text-sm">
                      {item.textbook_grade}
                    </TableCell>

                    {/* Created Date - hidden on mobile */}
                    <TableCell className="text-gray-600 dark:text-gray-300 px-2 sm:px-3 text-xs sm:text-sm italic hidden sm:table-cell">
                      {new Date(item.created_at).toLocaleDateString('ru-RU')}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase whitespace-nowrap ${item.status === 'pending'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        }`}>
                        {item.status === 'pending' ? t('table.pending') : t('table.accepted')}
                      </span>
                    </TableCell>

                    {/* Inventory Number - hidden on small screens */}
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1 sm:gap-2 text-gray-700 dark:text-gray-300 font-mono text-[10px] sm:text-xs">
                        <Barcode size={12} className="sm:w-3.5 sm:h-3.5 text-gray-400" />
                        {item.inventory_number || <span className="text-gray-400">{t('table.empty')}</span>}
                      </div>
                    </TableCell>

                    {/* Processed Date - hidden on tablets */}
                    <TableCell className="hidden lg:table-cell text-gray-600 dark:text-gray-300 px-2 sm:px-3 text-xs sm:text-sm italic">
                      {item.status === "accepted" && item.processed_at ? (
                        new Date(item.processed_at).toLocaleDateString('ru-RU')
                      ) : (
                        <span className="text-gray-400 not-italic">{t('table.notProcessed')}</span>
                      )}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right pr-2 sm:pr-3 md:pr-7">
                      {item.status === 'pending' ? (
                        <Button
                          onClick={() => {
                            setSelectedSupplyId(item.id);
                            setIsDialogOpen(true);
                          }}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-full"
                        >
                          <ArrowRightCircle size={16} className="sm:w-4 sm:h-4" />
                        </Button>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-bold px-2 sm:px-3">
                          {t('table.accepted')}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] w-[95%] rounded-xl dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className=" text-base sm:text-lg">
                <div className='flex items-center gap-2'>
                  <BookCheck className="text-blue-500 w-5 h-5" />
                  {t('dialog.title', { id: selectedSupplyId ?? '--' })}
                </div>
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                {t('dialog.description')}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAccept} className="space-y-4 py-3 sm:py-4">
              <div className="space-y-3">
                <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('dialog.inventoryLabel')}
                </label>
                <Input
                  autoFocus
                  placeholder={t('dialog.placeholder')}
                  value={inventoryNumber}
                  onChange={(e) => setInventoryNumber(e.target.value)}
                  className="focus-visible:ring-blue-500 h-10 sm:h-11 text-sm"
                />
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="order-2 sm:order-1"
                >
                  {t('dialog.back')}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 text-white hover:bg-blue-700 order-1 sm:order-2"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                      {t('dialog.confirming')}
                    </div>
                  ) : (
                    t('dialog.confirm')
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Pagination - Responsive */}
        <div className="p-3 sm:p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-800">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
            {t('pagination.showing', {
              start: indexOfFirstItem + 1,
              end: Math.min(indexOfLastItem, supplyData.items?.length || 0),
              total: supplyData.items?.length
            })}
          </div>
          <div className="flex gap-1 sm:gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="h-8 sm:h-9 text-xs sm:text-sm"
            >
              {t('pagination.prev')}
            </Button>
            <div className="flex items-center px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('pagination.page', { current: currentPage, total: totalPages })}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="h-8 sm:h-9 text-xs sm:text-sm"
            >
              {t('pagination.next')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}