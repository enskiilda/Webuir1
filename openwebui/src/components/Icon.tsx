import React from 'react';
import { Menu, Search, PenSquare, Plus, Send, Square, ChevronDown, MoreHorizontal, Copy, RotateCcw, ThumbsUp, ThumbsDown, Check, X } from 'lucide-react';

const icons: Record<string, React.FC<{ className?: string; strokeWidth?: number }>> = {
	Menu: ({ className }) => <Menu className={className || 'size-5'} />,
	Search: ({ className, strokeWidth }) => <Search className={className || 'size-5'} strokeWidth={strokeWidth || 2} />,
	PencilSquare: ({ className }) => <PenSquare className={className || 'size-5'} />,
	Plus: ({ className }) => <Plus className={className || 'size-5'} />,
	Send: ({ className }) => <Send className={className || 'size-5'} />,
	Stop: ({ className }) => <Square className={className || 'size-5'} />,
	ChevronDown: ({ className }) => <ChevronDown className={className || 'size-5'} />,
	MoreHorizontal: ({ className }) => <MoreHorizontal className={className || 'size-5'} />,
	Copy: ({ className }) => <Copy className={className || 'size-5'} />,
	RotateCcw: ({ className }) => <RotateCcw className={className || 'size-5'} />,
	ThumbsUp: ({ className }) => <ThumbsUp className={className || 'size-5'} />,
	ThumbsDown: ({ className }) => <ThumbsDown className={className || 'size-5'} />,
	Check: ({ className }) => <Check className={className || 'size-5'} />,
	X: ({ className }) => <X className={className || 'size-5'} />,
};

export default function Icon({ name, className, strokeWidth }: { name: string; className?: string; strokeWidth?: number }) {
	const IconComponent = icons[name];
	if (!IconComponent) {
		return <span className={className}>{name}</span>;
	}
	return <IconComponent className={className} strokeWidth={strokeWidth} />;
}
