'use client'

import { CopyIcon, ExternalLink, Search } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { PackData } from '../create/_components/PackForm'

const PackDetails = ({ id, type }: { id: string, type: string }) => {
  const [packToShow, setPack] = useState<PackData | null>(null)

  useEffect(() => {
    async function getPack() {
      const res = await fetch(`/api/packs/${id}`)
      const pack = await res.json()
      setPack(pack.data)
    }
    getPack()
  }, [id])

  const copyCommand = () => {
    navigator.clipboard.writeText(`/import ${type} ${id}`)
    toast({
      title: 'Copied to clipboard!'
    })
  }

  if (!packToShow) return null

  return (
    <>
      <DialogHeader>
        <DialogTitle>{packToShow.name}</DialogTitle>
        <DialogDescription>{packToShow.description}</DialogDescription>
      </DialogHeader>

      <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 my-2 lg:my-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-muted-foreground text-sm">Author</h3>
          <div className="flex items-center gap-1">
            <Image
              src="/staff/Dominik.webp"
              alt="profile image"
              width={32}
              height={32}
              className="rounded-full"
            />
            <p className="capitalize">Dominik</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-muted-foreground">Questions</h3>
          <p className="capitalize">{packToShow.questions.length}</p>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-muted-foreground">Type</h3>
          <p className="capitalize">{packToShow.type}</p>
        </div>
      </section>

      <section className="grid flex-1 gap-2 my-1">
        <label
          htmlFor="command"
          className="text-muted-foreground text-sm capitalize"
        >
          use the pack
        </label>
        <div className="w-full relative">
          <Input
            id="command"
            defaultValue={`/import ${type} ${id}`}
            readOnly
            className="focus:bg-brand-blue-100/10 focus:text-brand-blue-100"
          />
          <Button
            type="submit"
            size="sm"
            variant={'ghost'}
            onClick={copyCommand}
            className="p-2 h-fit text-brand-blue-100 hover:text-brand-blue-200 absolute right-2 top-1"
          >
            <span className="sr-only">Copy command</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <section>
        <p className="text-muted-foreground my-2 text-sm capitalize">
          look inside
        </p>
        <div className="border rounded-xl overflow-hidden">
          <div className="dark:bg-[#1D1D1D] bg-background-light flex items-center px-4 py-2 gap-4 border-b">
            <div className="relative md:w-3/4">
              <Search className="size-4 absolute left-2 bottom-3 dark:text-[#666666]" />
              <Input
                placeholder="Search questions"
                className="w-full pl-8 focus:ring-0"
              />
            </div>
          </div>
          <ul className="divide-y max-h-[100px] md:max-h-[200px] overflow-y-auto thin-scrollbar">
            {packToShow.questions.map((question, index) => (
              <li
                key={`${question.question}-${index}`}
                className="px-4 py-2"
              >
                <p className="line-clamp-1 text-sm">{question.question}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

export function QuestionPackDetails({ id, type }: { id: string, type: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            'w-full bg-brand-blue-100 hover:bg-brand-blue-200 text-white',
            {
              'popular-btn': false // You might want to adjust this based on your needs
            }
          )}
        >
          <ExternalLink className="mr-2 h-4 w-4 shrink-0" />{' '}
          <span>Use Pack</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-lg lg:max-w-2xl">
          {isOpen && <PackDetails id={id} type={type} />}
      </DialogContent>
    </Dialog>
  )
}
