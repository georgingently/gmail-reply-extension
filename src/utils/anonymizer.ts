export class Anonymizer {
    private maskEmails: boolean;
    private maskNumbers: boolean;
    private emailMap: Map<string, string>;
    private phoneMap: Map<string, string>;
    private emailCounter: number;
    private phoneCounter: number;

    constructor(maskEmails: boolean, maskNumbers: boolean) {
        this.maskEmails = maskEmails;
        this.maskNumbers = maskNumbers;
        this.emailMap = new Map();
        this.phoneMap = new Map();
        this.emailCounter = 1;
        this.phoneCounter = 1;
    }

    anonymize(text: string): string {
        let processedText = text;

        if (this.maskEmails) {
            // Regex for email
            const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
            processedText = processedText.replace(emailRegex, (match) => {
                if (!this.emailMap.has(match)) {
                    this.emailMap.set(match, `[EMAIL_${this.emailCounter++}]`);
                }
                return this.emailMap.get(match)!;
            });
        }

        if (this.maskNumbers) {
            // Basic regex for phone numbers (adjust as needed for international formats)
            // Matches: +1-555-555-5555, (555) 555-5555, 555-555-5555, 555 555 5555
            const phoneRegex = /(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;

            // Only mask if it looks like a phone number (at least 7 digits)
            processedText = processedText.replace(phoneRegex, (match) => {
                const digitCount = match.replace(/\D/g, '').length;
                if (digitCount < 7) return match;

                if (!this.phoneMap.has(match)) {
                    this.phoneMap.set(match, `[PHONE_${this.phoneCounter++}]`);
                }
                return this.phoneMap.get(match)!;
            });
        }

        return processedText;
    }

    deanonymize(text: string): string {
        let processedText = text;

        // Restore emails
        this.emailMap.forEach((placeholder, original) => {
            // Global replace for the placeholder
            // Escape brackets for regex
            const escapedPlaceholder = placeholder.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
            processedText = processedText.replace(new RegExp(escapedPlaceholder, 'g'), original);
        });

        // Restore phones
        this.phoneMap.forEach((placeholder, original) => {
            const escapedPlaceholder = placeholder.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
            processedText = processedText.replace(new RegExp(escapedPlaceholder, 'g'), original);
        });

        return processedText;
    }
}
