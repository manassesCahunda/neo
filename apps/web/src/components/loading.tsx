'use client';

import React from 'react';

import Lottie from 'lottie-react';

import loading from '@/assets/json/loading.json';

export const Spinner = () => (
  <Lottie
    animationData={loading}
    style={{
      width: '20px',
      height: '20px',
    }}
    loop={true}
  />
);
