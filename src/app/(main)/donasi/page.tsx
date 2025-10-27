
import { RekeningGrid } from "@/components/rekening-grid";
import { getRekening } from "@/lib/rekening-api";

export default async function DonasiPage() {
  const rekeningData = await getRekening();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center">
      <div className="container max-w-6xl mx-auto px-4">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Donasi
                  </h1>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Dukungan Anda sangat berarti bagi kami. Dengan berdonasi, Anda turut serta dalam menjaga dan melestarikan budaya.
                  </p>
                </div>
              </div>
              {rekeningData.length > 0 ? (
                <RekeningGrid rekeningData={rekeningData} />
              ) : (
                <div className="text-center py-10">
                  <p className="text-lg text-muted-foreground">
                    Gagal memuat rekening atau tidak ada rekening yang tersedia saat ini.
                  </p>
                </div>
              )}
            </div>
    </section>
  );
}
