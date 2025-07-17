
export interface Unidade {
    id: string;
    estado: string;
    cidade: string;
    whatsapp: string;
}

export const unidades: Unidade[] = [
    { id: '1', estado: 'São Paulo', cidade: 'São Paulo', whatsapp: '5511911111111' },
    { id: '2', estado: 'São Paulo', cidade: 'Campinas', whatsapp: '5519922222222' },
    { id: '3', estado: 'Rio de Janeiro', cidade: 'Rio de Janeiro', whatsapp: '5521933333333' },
    { id: '4', estado: 'Rio de Janeiro', cidade: 'Niterói', whatsapp: '5521944444444' },
    { id: '5', estado: 'Minas Gerais', cidade: 'Belo Horizonte', whatsapp: '5531955555555' },
    { id: '6', estado: 'Bahia', cidade: 'Salvador', whatsapp: '5571966666666' },
];
