'use client';

import React from 'react';

import { ModeToggle } from '@/components/mode-toggle';
import { Search } from '@/components/search';
import { UserNav } from '@/components/user-nav';

export const Nav = () => {
  return (
    <div className="hidden  flex-col md:flex">
      <div className="border-b  h-30 pt-3">
        <div className="flex h-16 items-center" style={{
          paddingRight:30
        }}>
          {/* <TeamSwitcher/> */}
          <div className="ml-auto flex items-center space-x-10">
            <Search  />
            {/* <NotificationCenter/> */}
            <ModeToggle/>
            <UserNav />
          </div>
        </div>
      </div>
    </div>
  );
};