"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";

type RekeningItem = {
  id: number;
  logo: string;
  namaBank: string;
  noRekening: string;
};

type RekeningGridProps = {
  rekeningData: RekeningItem[];
};

export function RekeningGrid({ rekeningData }: RekeningGridProps) {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      {rekeningData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rekeningData.map((rekening) => (
            <Card key={rekening.id} className="w-full shadow-none">
              <div className="inline-flex justify-between">
                <div className="flex px-4">
                  <Image
                    src={rekening.logo}
                    alt={rekening.namaBank}
                    width={100}
                    height={75}
                    className="object-contain"
                  />
                </div>
                <div className="p-4 text-right">
                  <h3 className="text-xl font-semibold">{rekening.namaBank}</h3>
                  <p className="text-lg text-muted-foreground">
                    {rekening.noRekening}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">
            Tidak ada rekening yang tersedia saat ini.
          </p>
        </div>
      )}
    </div>
  );
}
