import { create } from 'zustand';
import { APP_NAME } from '$lib/constants';

export type Model = OpenAIModel | OllamaModel;
type BaseModel = { id: string; name: string; info?: any; owned_by: 'ollama' | 'openai' | 'arena'; };
export interface OpenAIModel extends BaseModel { owned_by: 'openai'; external: boolean; source?: string; }
export interface OllamaModel extends BaseModel { owned_by: 'ollama'; details: any; size: number; description: string; model: string; modified_at: string; digest: string; ollama?: any; }
type Settings = Record<string, any>;
type Config = { license_metadata: any; status: boolean; name: string; version: string; default_locale: string; default_models: string; default_prompt_suggestions: { content: string; title: [string, string] }[]; features: { enable_admin_chat_access: boolean; enable_community_sharing: boolean }; ui?: any; };
export type SessionUser = { permissions: any; id: string; email: string; name: string; role: string; profile_image_url: string; };

const AI_MODELS: OpenAIModel[] = [
	{ id: 'moonshotai/kimi-k2-thinking', name: 'Kimi K2 Thinking', owned_by: 'openai', external: true, source: 'nvidia' },
	{ id: 'bytedance/seed-oss-36b-instruct', name: 'Seed 36B Instruct', owned_by: 'openai', external: true, source: 'nvidia' },
	{ id: 'deepseek-ai/deepseek-v3.1', name: 'DeepSeek V3.1', owned_by: 'openai', external: true, source: 'nvidia' },
	{ id: 'deepseek-ai/deepseek-r1-0528', name: 'DeepSeek R1', owned_by: 'openai', external: true, source: 'nvidia' },
	{ id: 'amazon/nova-2-lite-v1', name: 'Amazon Nova 2 Lite', owned_by: 'openai', external: true, source: 'openrouter' }
];

const defaultConfig: Config = {
	license_metadata: null, status: true, name: 'Open WebUI', version: '0.6.40', default_locale: 'pl-PL', default_models: 'moonshotai/kimi-k2-thinking',
	default_prompt_suggestions: [
		{ content: 'Wymyśl nazwę', title: ['Wymyśl nazwę', 'dla nowej kawiarni'] },
		{ content: 'Przetłumacz tekst', title: ['Przetłumacz tekst', 'z polskiego na angielski'] },
		{ content: 'Zadaj mi pytanie', title: ['Zadaj mi pytanie', 'żeby rozpocząć ciekawą rozmowę'] }
	],
	features: { enable_admin_chat_access: true, enable_community_sharing: true }
};

const defaultUser: SessionUser = {
	id: 'default', email: 'user@localhost', name: 'User', role: 'admin', profile_image_url: '/static/favicon.png',
	permissions: { chat: { temporary_enforced: false, multiple_models: true }, features: { image_generation: true, code_interpreter: true, web_search: true } }
};

interface StoreState {
	WEBUI_NAME: string; config: Config | undefined; user: SessionUser | undefined; isApp: boolean; mobile: boolean; socket: any; theme: string;
	chatId: string; chatTitle: string; chats: any[]; pinnedChats: any[]; tags: any[]; folders: any[]; selectedFolder: any; models: Model[];
	knowledge: any[]; tools: any[]; functions: any[]; toolServers: any[]; settings: Settings;
	showSidebar: boolean; showSearch: boolean; showSettings: boolean; showShortcuts: boolean; showArchivedChats: boolean; showChangelog: boolean;
	showControls: boolean; showEmbeds: boolean; showArtifacts: boolean; artifactCode: string; artifactContents: any; embed: any;
	temporaryChatEnabled: boolean; scrollPaginationEnabled: boolean; currentChatPage: number;
	setWEBUI_NAME: (v: string) => void; setConfig: (v: Config | undefined) => void; setUser: (v: SessionUser | undefined) => void;
	setMobile: (v: boolean) => void; setTheme: (v: string) => void; setChatId: (v: string) => void; setChatTitle: (v: string) => void;
	setChats: (v: any[]) => void; setPinnedChats: (v: any[]) => void; setTags: (v: any[]) => void; setFolders: (v: any[]) => void;
	setSelectedFolder: (v: any) => void; setModels: (v: Model[]) => void; setTools: (v: any[]) => void; setFunctions: (v: any[]) => void;
	setToolServers: (v: any[]) => void; setSettings: (v: Settings) => void; setShowSidebar: (v: boolean) => void; setShowSearch: (v: boolean) => void;
	setShowSettings: (v: boolean) => void; setShowShortcuts: (v: boolean) => void; setShowArchivedChats: (v: boolean) => void;
	setShowChangelog: (v: boolean) => void; setShowControls: (v: boolean) => void; setShowEmbeds: (v: boolean) => void;
	setShowArtifacts: (v: boolean) => void; setArtifactContents: (v: any) => void; setTemporaryChatEnabled: (v: boolean) => void;
	setScrollPaginationEnabled: (v: boolean) => void; setCurrentChatPage: (v: number) => void;
}

export const useStore = create<StoreState>((set) => ({
	WEBUI_NAME: APP_NAME, config: defaultConfig, user: defaultUser, isApp: false,
	mobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
	socket: null, theme: 'system', chatId: '', chatTitle: '', chats: [], pinnedChats: [], tags: [], folders: [], selectedFolder: null,
	models: AI_MODELS.map(m => ({ ...m, info: { meta: { capabilities: { vision: false, usage: true } } } })),
	knowledge: [], tools: [], functions: [], toolServers: [], settings: {},
	showSidebar: false, showSearch: false, showSettings: false, showShortcuts: false, showArchivedChats: false, showChangelog: false,
	showControls: false, showEmbeds: false, showArtifacts: false, artifactCode: '', artifactContents: {}, embed: null,
	temporaryChatEnabled: false, scrollPaginationEnabled: false, currentChatPage: 1,
	setWEBUI_NAME: (v) => set({ WEBUI_NAME: v }), setConfig: (v) => set({ config: v }), setUser: (v) => set({ user: v }),
	setMobile: (v) => set({ mobile: v }), setTheme: (v) => set({ theme: v }), setChatId: (v) => set({ chatId: v }),
	setChatTitle: (v) => set({ chatTitle: v }), setChats: (v) => set({ chats: v }), setPinnedChats: (v) => set({ pinnedChats: v }),
	setTags: (v) => set({ tags: v }), setFolders: (v) => set({ folders: v }), setSelectedFolder: (v) => set({ selectedFolder: v }),
	setModels: (v) => set({ models: v }), setTools: (v) => set({ tools: v }), setFunctions: (v) => set({ functions: v }),
	setToolServers: (v) => set({ toolServers: v }), setSettings: (v) => set({ settings: v }), setShowSidebar: (v) => set({ showSidebar: v }),
	setShowSearch: (v) => set({ showSearch: v }), setShowSettings: (v) => set({ showSettings: v }), setShowShortcuts: (v) => set({ showShortcuts: v }),
	setShowArchivedChats: (v) => set({ showArchivedChats: v }), setShowChangelog: (v) => set({ showChangelog: v }),
	setShowControls: (v) => set({ showControls: v }), setShowEmbeds: (v) => set({ showEmbeds: v }), setShowArtifacts: (v) => set({ showArtifacts: v }),
	setArtifactContents: (v) => set({ artifactContents: v }), setTemporaryChatEnabled: (v) => set({ temporaryChatEnabled: v }),
	setScrollPaginationEnabled: (v) => set({ scrollPaginationEnabled: v }), setCurrentChatPage: (v) => set({ currentChatPage: v }),
}));
