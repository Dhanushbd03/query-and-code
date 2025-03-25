import { useEffect, useState, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { io, Socket } from 'socket.io-client';
import { Loader2, Download, Wifi, WifiOff, Trash2, CheckCircle, XCircle, AlertTriangle, Info, Square } from "lucide-react";
import useScraping from '@/stores/logic/useScraping';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LogMessage {
  id: string;
  message: string;
  timestamp: number;
}

interface ScrapingLogsProps {
  onStop: () => Promise<void>;
}

export default function ScrapingLogs({ onStop }: ScrapingLogsProps) {
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { is_scraping: isScraping } = useScraping();

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(socketUrl, {
      withCredentials: true,
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      forceNew: true,
      path: '/socket.io/',
      extraHeaders: {
        'Access-Control-Allow-Origin': '*'
      }
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionError(null);
      setLogs([]);
    });

    socket.on('connect_error', (error) => {
      setIsConnected(false);
      setConnectionError(error.message);
    });

    socket.on('error', (error) => {
      setConnectionError(error.message);
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    socket.on('reconnect', () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on('reconnect_error', (error) => {
      setConnectionError(error.message);
    });

    socket.on('reconnect_failed', () => {
      setConnectionError('Failed to reconnect to server');
    });

    socket.on('scrape_log', (data) => {
      if (data && data.message) {
        setLogs(prevLogs => [...prevLogs, {
          id: Math.random().toString(36).substr(2, 9),
          message: data.message,
          timestamp: Date.now()
        }]);
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [logs]);

  const getLogIcon = (message: string) => {
    if (message.includes('✅')) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (message.includes('❌')) return <XCircle className="h-4 w-4 text-red-500" />;
    if (message.includes('⚠️')) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    if (message.includes('📥')) return <Download className="h-4 w-4 text-blue-500" />;
    return <Info className="h-4 w-4 text-gray-500" />;
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="h-full flex flex-col bg-ctp-surface1 rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-ctp-surface2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-ctp-text">Scraping Logs</h3>
          <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
            {isConnected ? (
              <>
                <Wifi className="h-3 w-3 text-green-500" />
                <p className="text-sm text-green-500">Connected</p>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-red-500" />
                <p className="text-sm text-red-500">Disconnected</p>
              </>
            )}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {isScraping && (
            <Button 
              variant="destructive"
              onClick={onStop}
              className="h-8"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>
          )}
          {isScraping && <Loader2 className="h-4 w-4 animate-spin text-ctp-text" />}
          <Button
            variant="ghost"
            size="icon"
            onClick={clearLogs}
            className="h-8 w-8 hover:bg-ctp-surface2"
          >
            <Trash2 className="h-4 w-4 text-ctp-text" />
          </Button>
        </div>
      </div>
      
      {connectionError && (
        <div className="mx-4 mt-4 rounded-md bg-red-500/10 border border-red-500/20 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Connection Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {connectionError}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 min-h-0 overflow-hidden" ref={scrollRef}>
        <ScrollArea className="h-full w-full">
          <div className="p-4 space-y-2 pb-8">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`flex items-start gap-2 rounded-md p-2 bg-ctp-base`}
              >
                <div className="mt-1">{getLogIcon(log.message)}</div>
                <div className="flex-1 space-y-1">
                  <p className={`text-sm text-ctp-text`}>
                    {log.message}
                  </p>
                  <p className="text-xs text-ctp-subtext0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="flex h-full items-center justify-center text-ctp-subtext0">
                No logs yet. Start scraping to see logs here.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 