'use client';

import React from 'react';
import Typewriter from 'typewriter-effect';

const TypewriterComponent: React.FC = () => {
  return (
      <div className="text-2xl font-medium text-yellow-400">
        <Typewriter
          options={{
            strings: ['POKEMON!','Gotta Catch \'Em All!'],
            autoStart: true,
            loop: true,
            delay: 75,
          }}
        />
      </div>
  );
};

export default TypewriterComponent;