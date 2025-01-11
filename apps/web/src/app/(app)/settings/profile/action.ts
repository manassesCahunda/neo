'use server';

import { createServerAction } from 'zsa';

import { Adapter } from '@neo/auth';
import { generateHash } from '@neo/bcrypt';

import { user } from './type';

export const updateUserAction = createServerAction()
  .input(user)
  .handler(async ({ input }) => {
    const { name, email, password, role, image } = input;
    
    try {

      const passwordHash = password ? await generateHash(password) : undefined;

      const updatedUser = await Adapter.updateUser(email, {
        name,
        email,
        role,
        image,
        passwordHash
      });

      if (!updatedUser) {
        return {
          success: false,
          message: 'User not found or update failed.',
        };
      }

      return {
        success: true,
        message: 'User updated successfully.',
        data: { name, email, role, image}
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        message: 'An error occurred while updating the user: ' + error.message,
      };
    }
  });
