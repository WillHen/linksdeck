import { http, HttpResponse } from 'msw';

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
    })
];