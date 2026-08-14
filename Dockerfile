FROM mcr.microsoft.com/dotnet/sdk:10.0
EXPOSE 5064

ENV PATH="$PATH:/usr/local/dotnet-tools"
WORKDIR /app/project
COPY . .
