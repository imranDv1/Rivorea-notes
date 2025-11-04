import Image from 'next/image'

export default function ContentSection() {
    
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-7xl space-y-8 px-6 md:space-y-16">
                <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
                    Stay organized and never lose your thoughts with Rivorea Notes.
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
                    <div className="relative mb-6 sm:mb-0">
                        <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                            <Image src="/Images/bg.jpeg" className="hidden rounded-[15px] dark:block max-h-[400px] object-cover " alt="rivorea notes dark illustration" width={1207} height={929} />
                            <Image src="/payments-light.png" className="rounded-[15px] shadow dark:hidden" alt="rivorea notes light illustration" width={1207} height={929} />
                        </div>
                    </div>

                    <div className="relative space-y-4">
                        <p className="text-muted-foreground">
                            Rivorea Notes is your all-in-one platform to capture, organize, and revisit your ideas. 
                            <span className="text-accent-foreground font-bold">Whether jotting quick memos or building long-term knowledge</span>, Rivorea adapts to your workflow.
                        </p>
                        <p className="text-muted-foreground">
                            Keep your notes accessible and beautifully organized — anywhere, on any device. Tag, search, and structure your thoughts with ease, and never lose sight of what matters most.
                        </p>

                        <div className="pt-6">
                            <blockquote className="border-l-4 pl-4">
                                <p>
                                    Rivorea Notes has transformed how I manage my ideas. It's intuitive, fast, and reliable — perfect for both quick notes and deep journaling.
                                </p>

                                <div className="mt-6 space-y-3">
                                    <cite className="block font-medium">Ahmed abdi, Writer</cite>
                                    <Image className="h-5 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/nvidia.svg" alt="Nvidia Logo" height={100} width={100} />
                                </div>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
