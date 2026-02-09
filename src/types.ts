export interface EmailData {
    sender: string;
    subject: string;
    content: string;
    timestamp?: string;
}

export interface ThreadData {
    id: string; // or some unique identifier if possible
    emails: EmailData[];
    myEmail?: string;
}
