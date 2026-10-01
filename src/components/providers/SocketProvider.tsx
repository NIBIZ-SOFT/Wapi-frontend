"use client";
import { SOCKET } from "@/src/constants/socket";
import { socket } from "@/src/services/socket-setup";
import { SocketProviderProps } from "@/src/types/components";
import { useSocketHandler } from "@/src/utils/hooks/useSocketHandler";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useGetWorkspacesQuery } from "@/src/redux/api/workspaceApi";

const SocketProvider = ({ children }: SocketProviderProps) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userId = session?.user?.id;

  const { data: workspacesData } = useGetWorkspacesQuery(undefined, {
    skip: !isAuthenticated,
  });

  useSocketHandler();

  useEffect(() => {
    if (isAuthenticated && userId) {
      if (!socket.connected) {
        socket.connect();
      }

      const joinWorkspaces = () => {
        const workspaces = workspacesData?.data || [];
        workspaces.forEach((ws: any) => {
          if (ws._id) {
            socket.emit("join-workspace", String(ws._id));
          }
        });
      };

      const handleConnect = () => {
        console.log("Socket connected");
        socket.emit(SOCKET.Emitters.Join_Room, userId);
        socket.emit(SOCKET.Emitters.Set_Online);
        socket.emit(SOCKET.Emitters.Request_Status_Update);
        joinWorkspaces();
      };

      const handleConnectError = (error: Error) => {
        console.error("Socket connection failed:", error);
      };

      const handleDisconnect = (reason: string) => {
        console.log("Socket disconnected:", reason);
      };

      socket.on("connect", handleConnect);
      socket.on("connect_error", handleConnectError);
      socket.on("disconnect", handleDisconnect);

      if (socket.connected) {
        socket.emit(SOCKET.Emitters.Join_Room, userId);
        joinWorkspaces();
      }

      return () => {
        socket.off("connect", handleConnect);
        socket.off("connect_error", handleConnectError);
        socket.off("disconnect", handleDisconnect);
      };
    } else {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [isAuthenticated, userId]);

  return <>{children}</>;
};

export default SocketProvider;
