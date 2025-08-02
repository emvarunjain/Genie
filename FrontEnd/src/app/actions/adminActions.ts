"use server";

import { revalidatePath } from 'next/cache';
import { API_BASE_URL } from '@/lib/config';

export async function getUsers(token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
            cache: 'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Failed to fetch users:', errorData);
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error in getUsers:", error);
        throw error;
    }
}

export async function updateUser(id: number, data: { is_active: boolean }, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Failed to update user:', errorData);
            throw new Error(`Failed to update user: ${response.statusText}`);
        }

        revalidatePath('/admin');
        return await response.json();
    } catch (error) {
        console.error("Error in updateUser:", error);
        throw error;
    }
}

export async function deleteUser(id: number, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.status !== 204) {
             const errorData = await response.text();
            console.error('Failed to delete user:', errorData);
            throw new Error(`Failed to delete user: ${response.statusText}`);
        }

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error("Error in deleteUser:", error);
        throw error;
    }
}
