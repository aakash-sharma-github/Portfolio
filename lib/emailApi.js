import axios from 'axios';

export const emailApi = async (values) => {
    try {
        const response = await axios.post('/api/contact', values);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to send email');
        }
    } catch (error) {
        throw error;
    }
};
