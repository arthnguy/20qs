import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useContext } from 'react';
import QuestionerActive from '../QuestionerActive';
import GameContext from '../../GameContext';
import socket from '../../socket';

jest.mock('../../socket', () => ({
    emit: jest.fn()
}));

const mockContextValue = {
    qaState: 'active',
    gameState: 'questioner',
    questionTime: 30
};

const MockGameContextProvider = ({ children, value = mockContextValue }) => (
    <GameContext.Provider value={value}>
        {children}
    </GameContext.Provider>
);

describe('QuestionerActive', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should render timer and question input when active', () => {
        render(
            <MockGameContextProvider>
                <QuestionerActive />
            </MockGameContextProvider>
        );

        expect(screen.getByText('Time: 30')).toBeInTheDocument();
        expect(screen.getByLabelText('Guessing character:')).toBeInTheDocument();
    });

    test('should countdown timer correctly', async () => {
        render(
            <MockGameContextProvider>
                <QuestionerActive />
            </MockGameContextProvider>
        );

        expect(screen.getByText('Time: 30')).toBeInTheDocument();
        
        jest.advanceTimersByTime(1000);
        await waitFor(() => {
            expect(screen.getByText('Time: 29')).toBeInTheDocument();
        });

        jest.advanceTimersByTime(1000);
        await waitFor(() => {
            expect(screen.getByText('Time: 28')).toBeInTheDocument();
        });
    });

    test('should auto-submit when timer reaches zero', async () => {
        render(
            <MockGameContextProvider>
                <QuestionerActive />
            </MockGameContextProvider>
        );

        jest.advanceTimersByTime(30000);
        
        await waitFor(() => {
            expect(socket.emit).toHaveBeenCalledWith('send_question', '', false, 0, expect.any(Function));
        });
    });

    test('should toggle guessing character mode', () => {
        render(
            <MockGameContextProvider>
                <QuestionerActive />
            </MockGameContextProvider>
        );

        const checkbox = screen.getByLabelText('Guessing character:');
        fireEvent.click(checkbox);
        
        expect(checkbox).toBeChecked();
    });

    test('should send question when button clicked', () => {
        render(
            <MockGameContextProvider>
                <QuestionerActive />
            </MockGameContextProvider>
        );

        const sendButton = screen.getByText('Send');
        fireEvent.click(sendButton);
        
        expect(socket.emit).toHaveBeenCalledWith('send_question', '', false, expect.any(Number), expect.any(Function));
    });

    test('should not render when game state is not questioner', () => {
        const inactiveContext = { ...mockContextValue, gameState: 'answerer' };
        
        render(
            <MockGameContextProvider value={inactiveContext}>
                <QuestionerActive />
            </MockGameContextProvider>
        );

        expect(screen.queryByText('Time:')).not.toBeInTheDocument();
    });

    test('should clean up timer on unmount', () => {
        const { unmount } = render(
            <MockGameContextProvider>
                <QuestionerActive />
            </MockGameContextProvider>
        );

        const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
        unmount();
        
        expect(clearIntervalSpy).toHaveBeenCalled();
    });
});