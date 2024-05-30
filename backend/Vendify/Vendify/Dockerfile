#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["/home/runner/work/Vendify/Vendify/backend/Vendify/Vendify/Vendify.csproj", "Vendify/"]
COPY ["/home/runner/work/Vendify/Vendify/backend/Vendify/DataAcces/DataAcces/DataAcces.csproj", "DataAcces/DataAcces/"]
COPY ["/home/runner/work/Vendify/Vendify/backend/Vendify/Shared/Shared/Shared.csproj", "Shared/Shared/"]
RUN dotnet restore "/home/runner/work/Vendify/Vendify/backend/Vendify/Vendify/Vendify.csproj"
COPY . .
WORKDIR "/src/Vendify"
RUN dotnet build "/home/runner/work/Vendify/Vendify/backend/Vendify/Vendify.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "/home/runner/work/Vendify/Vendify/backend/Vendify/Vendify.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Vendify.dll"]