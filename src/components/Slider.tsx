"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Slider() {
  return (
    <section className="h-screen w-full">
      <Swiper
        modules={[Pagination, Autoplay]}
        loop={true}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
      >
        <SwiperSlide>
          <div className="relative h-screen w-full flex items-center justify-end p-10">
            <Image
              src="/images/slider/5.jpg"
              alt="Sempe Dollar Murni Collection"
              fill
              className="object-cover"
              priority
            />
            <div className="relative z-10 text-white text-right">
              <h2 className="text-5xl font-bold">Sempe Dollar Murni</h2>
              <p className="mt-4">A New Collection of 2022</p>
              <button className="mt-6 bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition">
                Shop Now
              </button>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative h-screen w-full">
            <Image
              src="/images/slider/4.jpg"
              alt="Sempe Dollar Collection Slider"
              fill
              className="object-cover"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}
