build:
	tmux new-session 'cd backend && make dev'\; splitw -h 'cd frontend && pnpm dev'\; attach
