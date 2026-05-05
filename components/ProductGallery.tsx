'use client';

/**
 * Client-side product gallery built on Swiper. Encapsulates:
 *   - the carousel of images
 *   - an optional ReactPlayer slide for video
 *   - a modal viewer (open by clicking any slide)
 *
 * Static HTML still ships images with proper alt text so that crawlers can
 * read them — JS only enhances interactivity.
 */
import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Loaded AFTER the swiper bundles so our overrides win.
import '@/styles/swiper-overrides.css';

import modal from '@/styles/modal.module.css';

interface Props {
  productName: string;
  album: string[];
  video?: string;
}

// Lazy-load ReactPlayer only when there is actually a video to render — it's
// fairly heavy and unrelated to the carousel itself.
function VideoSlide({ url }: { url: string }) {
  // dynamic require avoids pulling react-player into pages that don't need it
  const ReactPlayer = require('react-player/lazy').default;
  return <ReactPlayer controls width="100%" height="100%" url={url} />;
}

export function ProductGallery({ productName, album, video }: Props) {
  const [active, setActive] = useState(false);
  const hasVideo = typeof video === 'string' && video.trim().length > 5;
  const totalImages = album.filter(Boolean).length;
  const totalVideos = hasVideo ? 1 : 0;

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
      >
        {album.filter(Boolean).map((src, idx) => (
          <SwiperSlide key={idx} className="modal_swiper_slide" onClick={() => setActive(true)}>
            <Image
              src={src}
              alt={`${productName} — фото ${idx + 1}`}
              width={1200}
              height={900}
              sizes="(max-width: 768px) 100vw, 60vw"
              priority={idx === 0}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              
            />
          </SwiperSlide>
        ))}
        {hasVideo && (
          <SwiperSlide>
            <VideoSlide url={video!} />
          </SwiperSlide>
        )}
        {totalImages > 0 && (
          <div className="items">
            <div className="imageCount">{totalImages}</div>
            <div className="videoCount">{totalVideos}</div>
          </div>
        )}
      </Swiper>

      <div
        className={active ? modal.modal_active : modal.modal}
        onClick={() => setActive(false)}
        role="dialog"
        aria-modal={active}
        aria-label={`${productName} — галерея`}
      >
        <div className={modal.modal_content} onClick={(e) => e.stopPropagation()}>
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
          >
            {album.filter(Boolean).map((src, idx) => (
              <SwiperSlide key={`m-${idx}`}>
                <Image
                  src={src}
                  alt={`${productName} — велике фото ${idx + 1}`}
                  width={1920}
                  height={1080}
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto', maxHeight: '90vh', objectFit: 'contain' }}
                  
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
