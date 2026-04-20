"use client"
import { useState } from "react"
import ItemList from "@/components/ItemList"
import PageFrame from "@/components/PageFrame"
import SearchInput from "@/components/SearchInput"
import { ControlsIcon } from "@/components/Icons"
import SquareButton from "@/components/SquareButton"
import Modal from "@/components/Modal"
import LabelField from "@/components/LabelField"
import Toggle from "@/components/Toggle"
import FieldFrame from "@/components/FieldFrame"

export default function MemoryPage() {
    const [search, setSearch] = useState("")
    const [filterModalOpen, setFilterModalOpen] = useState(false)
    const [completed, setCompleted] = useState(false)

    return (
        <PageFrame
            header={{
                center: (
                    <SearchInput
                        placeholder="Search..."
                        value={search}
                        onChange={(val) => setSearch(val)}
                    />
                ),
                right: (
                    <SquareButton
                        icon={<ControlsIcon />}
                        onClick={() => setFilterModalOpen(true)}
                    />
                )
            }}
        >
            <ItemList />
            <Modal
                label="Filter Agenda Items"
                open={filterModalOpen}
                onRequestClose={() => setFilterModalOpen(false)}
            >
                <FieldFrame>
                    <LabelField label="Completed">
                        <Toggle on={completed} onChange={(val) => setCompleted(val)} />
                    </LabelField>
                </FieldFrame>
            </Modal>
        </PageFrame>
    )
}