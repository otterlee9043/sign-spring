package com.sign.domain.classroom.repository;

import com.sign.domain.classroom.entity.Room;
import com.sign.domain.member.entity.Member;

import java.util.List;
import java.util.Optional;

public interface RoomRepository {

    Room save(Room classroom);

    Optional<Room> findById(Long roomId);

    List<Room> findByName(String roomName);

    Optional<Room> findByCode(String roomCode);

    List<Room> findByHost(Member host);

    List<Room> findAll();

    void delete(Room classroom);

    boolean checkAttached(Room classroom);
}
