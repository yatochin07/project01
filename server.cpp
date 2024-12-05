#include <iostream>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <string.h>
#include <arpa/inet.h>

#define PORT 8080

void handleClient(int clientSocket) {
    char buffer[1024];
    while (true) {
        int bytesReceived = recv(clientSocket, buffer, sizeof(buffer), 0);
        if (bytesReceived <= 0) {
            std::cerr << "Connection closed or error\n";
            break;
        }
        buffer[bytesReceived] = '\0';  // Menambahkan null-terminator
        std::cout << "Received: " << buffer << std::endl;
        
        // Kirim pesan balasan
        send(clientSocket, buffer, bytesReceived, 0);
    }
    close(clientSocket);
}

int main() {
    int serverSocket;
    struct sockaddr_in serverAddr, clientAddr;
    socklen_t clientAddrLen = sizeof(clientAddr);

    serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) {
        std::cerr << "Error in creating socket\n";
        return -1;
    }

    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(PORT);

    if (bind(serverSocket, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        std::cerr << "Error in binding socket\n";
        return -1;
    }

    if (listen(serverSocket, 5) < 0) {
        std::cerr << "Error in listening\n";
        return -1;
    }

    std::cout << "Server is listening on port " << PORT << "\n";

    while (true) {
        int clientSocket = accept(serverSocket, (struct sockaddr*)&clientAddr, &clientAddrLen);
        if (clientSocket < 0) {
            std::cerr << "Error in accepting client\n";
            continue;
        }

        std::cout << "Client connected\n";
        handleClient(clientSocket);
    }

    close(serverSocket);
    return 0;
}
