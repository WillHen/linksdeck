import { http, HttpResponse } from 'msw';

import dotenv from 'dotenv';

dotenv.config({ path: './.env.test', override: true });

export const handlers = [
    http.get('api/user', () => {
        return HttpResponse.json({ user: { id: '123', name: 'Test User' } })
    }),

    http.get('api/lists/:id', () => {
        return HttpResponse.json({ list: { title: '123', description: 'a list' } })
    }),

    http.get('api/links', () => {
        return HttpResponse.json({
            links: [
                { id: '1', title: 'Link 1', url: 'https://example.com/1' },
                { id: '2', title: 'Link 2', url: 'https://example.com/2' }
            ]
        })
    }),

    http.put('api/lists/:list_id', () => {
        return HttpResponse.json({ ok: true })
    }),

    http.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/lists?select=*&list_id=eq.1`, () => {
        return HttpResponse.json(
            {
                id: '6380887d-8749-4f6f-8380-821108847402',
                user_id: '85dbe305-9eb3-4e91-b9c2-fe9fa10c23c2',
                title: 'My List',
                description: 'This is a test list',
                public: true,
                created_at: '2025-05-10T15:20:02.431885',
                link_count: 1

            })
    }),

    http.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/links?select=*&list_id=eq.6380887d-8749-4f6f-8380-821108847402`, () => {
        return HttpResponse.json([
            {
                id: '25de3ed8-12d3-485f-8a72-ce71f4e92ad7',
                list_id: '6380887d-8749-4f6f-8380-821108847402',
                url: 'https://example.com',
                title: 'Example Link 2',
                description: 'This is an example link',
                created_at: '2025-05-10T15:20:02.436091',
                user_id: '85dbe305-9eb3-4e91-b9c2-fe9fa10c23c2'
            }
        ])
    })
];