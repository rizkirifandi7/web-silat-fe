import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const PageSeminar = () => {
  return (
    <div className="w-full min-h-dvh bg-background">
      <div className='container mx-auto px-4 py-16 md:py-24'>
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
							Seminar
						</h1>
						<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Informasi mengenai seminar yang sedang dan akan datang.
						</p>
					</div>
				</div>

        <div className='mt-12 justify-center gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 justify-self-center'>
          <Card className="max-w-sm p-0 overflow-hidden shadow-none" >
            <div className="relative w-full h-48">
              <Image 
                className="object-cover rounded-t-lg" 
                src="/silat.jpg" 
                fill
                alt="Seminar Silat" 
              />
            </div>
            <div className="px-5 pb-5">
              <Link href="/seminar/{id}" className="hover:underline">
                <h5 className="mb-2 text-2xl font-medium tracking-tight text-gray-900 dark:text-white">Seminar 1</h5>
              </Link>
              <p className="mb-3 font-sm text-gray-700 dark:text-gray-400 line-clamp-5 text-justify">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic, aperiam accusantium nam aliquid quis in eligendi, officia, architecto vero vel qui nemo? Fuga tempora enim sed? Quod voluptate illum eum.</p>

              <Link href="/seminar/id" className="inline-flex items-center py-2 text-sm font-medium text-center text-white rounded-lg">
                <Button variant="default" size="lg" className="group">
								Daftar
								<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
							</Button>
              </Link>
            </div>
          </Card>

          <Card className="max-w-sm p-0 overflow-hidden shadow-none" >
            <div className="relative w-full h-48">
              <Image 
                className="object-cover rounded-t-lg" 
                src="/silat.jpg" 
                fill
                alt="Seminar Silat" 
              />
            </div>
            <div className="px-5 pb-5">
              <Link href="/seminar/{id}" className="hover:underline">
                <h5 className="mb-2 text-2xl font-medium tracking-tight text-gray-900 dark:text-white">Seminar 1</h5>
              </Link>
              <p className="mb-3 font-sm text-gray-700 dark:text-gray-400 line-clamp-5">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic, aperiam accusantium nam aliquid quis in eligendi, officia, architecto vero vel qui nemo? Fuga tempora enim sed? Quod voluptate illum eum.</p>

              <Link href="/seminar/id" className="inline-flex items-center py-2 text-sm font-medium text-center text-white rounded-lg">
                <Button variant="default" size="lg" className="group">
								Daftar
								<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
							</Button>
              </Link>
            </div>
          </Card>

          <Card className="max-w-sm p-0 overflow-hidden shadow-none" >
            <div className="relative w-full h-48">
              <Image 
                className="object-cover rounded-t-lg" 
                src="/silat.jpg" 
                fill
                alt="Seminar Silat" 
              />
            </div>
            <div className="px-5 pb-5">
              <Link href="/seminar/{id}" className="hover:underline">
                <h5 className="mb-2 text-2xl font-medium tracking-tight text-gray-900 dark:text-white">Seminar 1</h5>
              </Link>
              <p className="mb-3 font-sm text-gray-700 dark:text-gray-400 line-clamp-5">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic, aperiam accusantium nam aliquid quis in eligendi, officia, architecto vero vel qui nemo? Fuga tempora enim sed? Quod voluptate illum eum.</p>

              <Link href="/seminar/id" className="inline-flex items-center py-2 text-sm font-medium text-center text-white rounded-lg">
                <Button variant="default" size="lg" className="group">
								Daftar
								<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
							</Button>
              </Link>
            </div>
          </Card>

          
        </div>
      </div>
    </div>
  )
}

export default PageSeminar