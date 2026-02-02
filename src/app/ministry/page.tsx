'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    useGetRegionsQuery, useGetDistrictsQuery, useAddDistrictMutation,
    useDeleteDistrictMutation, useGetSchoolsByDistrictQuery, useDeleteSchoolMutation,
    useAddRegionMutation, useAddSchoolMutation,
    useUpdateDistrictMutation, useUpdateSchoolMutation,
    useUpdateRegionMutation,
    useDeleteRegionMutation
} from '@/src/api/api'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Landmark, Trash2, School, Search, Plus, Edit2, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export default function MinistryPage() {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState(1)
    const [addType, setAddType] = useState<'region' | 'district' | 'school' | null>(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editId, setEditId] = useState<number | null>(null)

    const [formData, setFormData] = useState({ name: "", region_id: "", district_id: "" })
    const [selectedRegionId, setSelectedRegionId] = useState<string>("")
    const [selectedDistrictId, setSelectedDistrictId] = useState<string>("")

    // API Queries
    const { data: regions } = useGetRegionsQuery()
    const { data: districts } = useGetDistrictsQuery(Number(selectedRegionId), { skip: !selectedRegionId })
    const { data: schools } = useGetSchoolsByDistrictQuery(Number(selectedDistrictId), { skip: !selectedDistrictId })

    // API Mutations
    const [addRegion] = useAddRegionMutation()
    const [addDistrict] = useAddDistrictMutation()
    const [addSchool] = useAddSchoolMutation()
    const [updateDistrict] = useUpdateDistrictMutation()
    const [updateSchool] = useUpdateSchoolMutation()
    const [deleteDistrict] = useDeleteDistrictMutation()
    const [deleteSchool] = useDeleteSchoolMutation()
    const [updateRegion] = useUpdateRegionMutation()
    const [deleteRegion] = useDeleteRegionMutation()

    const resetForm = () => {
        setStep(1); setAddType(null); setIsEditMode(false); setEditId(null);
        setFormData({ name: "", region_id: "", district_id: "" });
        setIsOpen(false);
    }

    const openEditModal = (type: 'region' | 'district' | 'school', item: any) => {
        setAddType(type);
        setIsEditMode(true);
        setEditId(item.id);
        setFormData({
            name: item.name,
            region_id: type === 'district' ? selectedRegionId : "",
            district_id: type === 'school' ? selectedDistrictId : ""
        });
        setStep(2);
        setIsOpen(true);
    }

    const handleSubmit = async () => {
        try {
            if (isEditMode && editId) {
                if (addType === 'district') {
                    await updateDistrict({ id: editId, name: formData.name, region_id: Number(selectedRegionId) }).unwrap();
                }
                if (addType === 'school') {
                    await updateSchool({ id: editId, name: formData.name, district_id: Number(selectedDistrictId) }).unwrap();
                }
                if (addType === 'region') {
                    await updateRegion({ id: editId, name: formData.name }).unwrap();
                }
            } else {
                if (addType === 'region') await addRegion({ name: formData.name }).unwrap();
                if (addType === 'district') await addDistrict({ name: formData.name, region_id: Number(formData.region_id) }).unwrap();
                if (addType === 'school') await addSchool({ name: formData.name, district_id: Number(formData.district_id) }).unwrap();
            }
            resetForm();
        } catch (err) { console.error(err) }
    }


    return (
        <div className="p-4 md:p-8 space-y-6 bg-[#f8f9fa] min-h-screen font-sans">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Вазорати Маориф</h1>
                <Dialog open={isOpen} onOpenChange={(val) => { if (!val) resetForm(); setIsOpen(val); }}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#0950c3] rounded-xl h-11 px-6 hover:bg-[#0741a1] transition-all">
                            <Plus className="w-5 h-5 mr-2" /> Иловаи нав
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-[24px] p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-center">
                                {isEditMode ? "Таҳрир кардан" : (step === 1 ? "Чиро илова мекунед?" : "Маълумотро ворид кунед")}
                            </DialogTitle>
                        </DialogHeader>

                        {step === 1 && (
                            <div className="grid gap-3 py-6">
                                <Button variant="outline" onClick={() => { setAddType('region'); setStep(2); }} className="h-16 justify-between px-6 rounded-2xl border-gray-100 hover:border-[#0950c3] hover:bg-blue-50/50 group">
                                    <div className="flex items-center gap-4"><div className="p-2 bg-blue-50 rounded-lg group-hover:bg-white"><Landmark className="w-5 h-5 text-blue-600" /></div> Вилоят</div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </Button>
                                <Button variant="outline" onClick={() => { setAddType('district'); setStep(2); }} className="h-16 justify-between px-6 rounded-2xl border-gray-100 hover:border-orange-500 hover:bg-orange-50/50 group">
                                    <div className="flex items-center gap-4"><div className="p-2 bg-orange-50 rounded-lg group-hover:bg-white"><MapPin className="w-5 h-5 text-orange-600" /></div> Ноҳия</div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </Button>
                                <Button variant="outline" onClick={() => { setAddType('school'); setStep(2); }} className="h-16 justify-between px-6 rounded-2xl border-gray-100 hover:border-green-500 hover:bg-green-50/50 group">
                                    <div className="flex items-center gap-4"><div className="p-2 bg-green-50 rounded-lg group-hover:bg-white"><School className="w-5 h-5 text-green-600" /></div> Мактаб</div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-5 py-4">
                                {addType === 'district' && !isEditMode && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Интихоби вилоят</Label>
                                        <Select onValueChange={(val) => setFormData({ ...formData, region_id: val })}>
                                            <SelectTrigger className="rounded-xl h-12 border-gray-200"><SelectValue placeholder="Вилоятро интихоб кунед" /></SelectTrigger>
                                            <SelectContent className="rounded-xl">{regions?.map((r: any) => <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                )}
                                {addType === 'school' && !isEditMode && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Интихоби ноҳия</Label>
                                        <Select onValueChange={(val) => setFormData({ ...formData, district_id: val })}>
                                            <SelectTrigger className="rounded-xl h-12 border-gray-200"><SelectValue placeholder="Ноҳияро интихоб кунед" /></SelectTrigger>
                                            <SelectContent className="rounded-xl">{districts?.map((d: any) => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Номгузорӣ</Label>
                                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Номро ворид кунед..." className="rounded-xl h-12 border-gray-200 focus:ring-[#0950c3]" />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button variant="ghost" onClick={() => isEditMode ? resetForm() : setStep(1)} className="flex-1 h-12 rounded-xl">Бозгашт</Button>
                                    <Button onClick={handleSubmit} className="flex-[2] bg-[#0950c3] h-12 rounded-xl shadow-lg shadow-blue-200">Захира кардан</Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="regions" className="w-full">
                <TabsList className="bg-white border-none rounded-2xl h-14 p-1.5 shadow-sm inline-flex w-full md:w-auto">
                    <TabsTrigger value="regions" className="rounded-xl px-8 h-full data-[state=active]:bg-[#0950c3] data-[state=active]:text-white transition-all">Вилоятҳо</TabsTrigger>
                    <TabsTrigger value="districts" className="rounded-xl px-8 h-full data-[state=active]:bg-[#0950c3] data-[state=active]:text-white transition-all">Ноҳияҳо</TabsTrigger>
                    <TabsTrigger value="schools" className="rounded-xl px-8 h-full data-[state=active]:bg-[#0950c3] data-[state=active]:text-white transition-all">Мактабҳо</TabsTrigger>
                </TabsList>

                <TabsContent value="regions" className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {regions?.map((reg: any) => (
                            <Card key={reg.id} className="rounded-[24px] border-none shadow-sm group hover:ring-2 ring-blue-100 transition-all">
                                <CardContent className="p-6 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                            <Landmark className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{reg.name}</h4>
                                            <p className="text-xs text-gray-400">Ҷумҳурии Тоҷикистон</p>
                                        </div>
                                    </div>

                                    {/* ТУГМАҲОИ НАВ: */}
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openEditModal('region', reg)}
                                            className="text-blue-500 hover:bg-blue-50 rounded-xl"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteRegion(reg.id)}
                                            className="text-red-400 hover:bg-red-50 rounded-xl"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Districts Tab */}
                <TabsContent value="districts" className="mt-8 space-y-6">
                    <Card className="rounded-[24px] border-none shadow-sm p-6 bg-white">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-50 rounded-xl"><Search className="text-orange-600 w-6 h-6" /></div>
                                <div><h3 className="font-bold text-lg">Ҷустуҷӯи ноҳияҳо</h3><p className="text-sm text-gray-500">Вилоятро барои филтр интихоб кунед</p></div>
                            </div>
                            <Select onValueChange={setSelectedRegionId} value={selectedRegionId}>
                                <SelectTrigger className="w-full md:w-[320px] h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:ring-orange-500"><SelectValue placeholder="Интихоби вилоят..." /></SelectTrigger>
                                <SelectContent className="rounded-xl">{regions?.map((r: any) => <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {districts?.map((dist: any) => (
                            <Card key={dist.id} className="rounded-[24px] border-none shadow-sm group hover:ring-2 ring-orange-100 transition-all">
                                <CardContent className="p-5 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600"><MapPin className="w-5 h-5" /></div>
                                        <h4 className="font-bold">{dist.name}</h4>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" onClick={() => openEditModal('district', dist)} className="text-blue-500 hover:bg-blue-50 rounded-xl"><Edit2 className="w-4 h-4" /></Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-50 rounded-xl"><Trash2 className="w-4 h-4" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="rounded-[24px]">
                                                <AlertDialogHeader><AlertDialogTitle>Боварӣ доред?</AlertDialogTitle><AlertDialogDescription>Ноҳияи "{dist.name}" нест мешавад.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="rounded-xl">Инкор</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteDistrict(dist.id)} className="rounded-xl bg-red-500 hover:bg-red-600 border-none">Нест кардан</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Schools Tab */}
                <TabsContent value="schools" className="mt-8 space-y-6">
                    <Card className="rounded-[24px] border-none shadow-sm p-6 bg-white">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-50 rounded-xl"><Search className="text-green-600 w-6 h-6" /></div>
                                <div><h3 className="font-bold text-lg">Ҷустуҷӯи мактабҳо</h3><p className="text-sm text-gray-500">Вилоят ва ноҳияро интихоб кунед</p></div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                <Select onValueChange={setSelectedRegionId} value={selectedRegionId}>
                                    <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border-gray-100 bg-gray-50/50"><SelectValue placeholder="Вилоят" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">{regions?.map((r: any) => <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>)}</SelectContent>
                                </Select>
                                <Select onValueChange={setSelectedDistrictId} value={selectedDistrictId} disabled={!selectedRegionId}>
                                    <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border-gray-100 bg-gray-50/50"><SelectValue placeholder="Ноҳия" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">{districts?.map((d: any) => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {schools?.map((school: any) => (
                            <Card key={school.id} className="rounded-[24px] border-none shadow-sm group hover:ring-2 ring-green-100 transition-all">
                                <CardContent className="p-5 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600"><School className="w-5 h-5" /></div>
                                        <h4 className="font-bold">{school.name}</h4>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" onClick={() => openEditModal('school', school)} className="text-blue-500 hover:bg-blue-50 rounded-xl"><Edit2 className="w-4 h-4" /></Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-50 rounded-xl"><Trash2 className="w-4 h-4" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="rounded-[24px]">
                                                <AlertDialogHeader><AlertDialogTitle>Боварӣ доред?</AlertDialogTitle><AlertDialogDescription>Мактаби "{school.name}" нест мешавад.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="rounded-xl">Инкор</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteSchool(school.id)} className="rounded-xl bg-red-500 hover:bg-red-600 border-none">Нест кардан</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}