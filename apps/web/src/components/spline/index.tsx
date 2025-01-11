'use client';

import React, { Suspense } from 'react';

const Spline = React.lazy(() => import('@splinetool/react-spline'));

export default function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Spline style={{
          width:800,
          height:1000
        }} scene="https://prod.spline.design/OitzRD4T5shHMNaJ/scene.splinecode" />
      </Suspense>
    </div>
  );
}

//https://prod.spline.design/OitzRD4T5shHMNaJ/scene.splinecode

//https://prod.spline.design/OitzRD4T5shHMNaJ/scene.splinecode