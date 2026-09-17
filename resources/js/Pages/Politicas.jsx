import { Link } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';

const PUNTOS = [
    'Garantizar la satisfacción de nuestros clientes y mejorar continuamente los procesos para seguir entregando servicio de calidad.',
    'Estamos comprometidos a la protección del medio ambiente y al control de los aspectos e impactos ambientales, durante la prestación de nuestros servicios.',
    'Dar cumplimiento a los requisitos legales y otras disposiciones generadas por nuestras partes interesadas.',
    'Velar por la salud y seguridad de todos nuestros colaboradores mediante la identificación, control y valoración de los peligros, mejorando las condiciones de trabajo para prevenir accidentes y enfermedades laborales.',
];

export default function Politicas() {
    return (
        <SiteLayout title="Política integral">
            <div className="border-b border-mist-300 bg-mist-50 px-5 py-8 lg:px-10 lg:py-9">
                <div className="mb-2 text-[12.5px] text-ink-500">
                    <Link href={route('home')} className="hover:text-green-dark">Inicio</Link> / Política integral
                </div>
                <h1 className="mb-2 font-display text-[28px] font-extrabold tracking-tight text-navy lg:text-[34px]">
                    Política integral de gestión
                </h1>
                <p className="max-w-[580px] text-[15px] text-navy-500">
                    Certificados ISO 9001 · IQNET Certified Management System.
                </p>
            </div>

            <div className="rounded-none bg-navy-deep px-5 py-12 lg:px-10 lg:py-14">
                <div className="mx-auto max-w-[760px]">
                    <p className="mb-7 text-[15.5px] leading-relaxed text-white/80 text-pretty">
                        ALWAYS CLEAN COLOMBIA S.A.S tiene como propósito principal la prestación de servicios ambientales
                        y de obra civil, esto lo hacemos desde el marco de la sostenibilidad y la mejora de nuestros
                        procesos buscando:
                    </p>
                    <ol className="mb-9 flex flex-col gap-4">
                        {PUNTOS.map((p, i) => (
                            <li key={p} className="flex gap-4 text-[14.5px] leading-relaxed text-white/80">
                                <span className="font-display text-lg font-extrabold text-green-bright">{i + 1}</span>
                                {p}
                            </li>
                        ))}
                    </ol>
                    <p className="mb-9 text-[14.5px] leading-relaxed text-white/65 text-pretty">
                        Esta política tiene alcance para todos los centros de trabajo y durante la prestación de
                        servicios, incluyendo colaboradores, contratistas y visitantes, la cual sirve como marco de
                        construcción de los objetivos de los sistemas de gestión de la compañía.
                    </p>
                    <div className="flex flex-col gap-1 border-t border-white/15 pt-6">
                        <div className="font-display text-[15px] font-semibold text-white">Jhayson Malambo T.</div>
                        <div className="text-[13px] text-white/60">Representante legal</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 text-[12.5px] text-ink-500 lg:px-10">
                <span>Código: PO-SGI-001</span>
                <span>Fecha: 24/01/2023</span>
                <span>Versión 2</span>
            </div>
        </SiteLayout>
    );
}
